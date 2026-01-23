import { useState, useCallback, useRef } from 'react';
import { Platform, Alert, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import SoundRecorder, {
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-nitro-sound';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import stringSimilarity from 'string-similarity';
import { get } from 'lodash';
import logger from '../../../utils/logger';
import {
  GLADIA_API_KEY,
  GLADIA_UPLOAD_URL,
  GLADIA_TRANSCRIPTION_URL,
  AUDIO_FILE_EXTENSION,
  TRANSCRIPTION_POLL_INTERVAL,
  AUDIO_FILE_PREFIX,
} from '../../../constants/constants';

export const useRecording = (learnGeeta, handleSaveResult) => {
  const [isRecordingButton, setIsRecordingButton] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [waitingForTranslation, setWaitingForTranslation] = useState(false);

  const recordingStartedAt = useRef(0);

  /* -------------------- Permissions -------------------- */

  const REQUIRED_PERMISSIONS = Platform.select({
    android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
    ios: [PERMISSIONS.IOS.MICROPHONE],
  });

  const requestPermissions = useCallback(async () => {
    try {
      const results = await Promise.all(
        REQUIRED_PERMISSIONS.map((p) => check(p)),
      );

      if (results.every((r) => r === RESULTS.GRANTED)) {
        return true;
      }

      const requestResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((p) => request(p)),
      );

      if (
        requestResults.some(
          (r) => r === RESULTS.BLOCKED || r === RESULTS.DENIED,
        )
      ) {
        Alert.alert(
          'Permission required',
          'Enable microphone permission from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openSettings },
          ],
        );
        return false;
      }

      return requestResults.every((r) => r === RESULTS.GRANTED);
    } catch (e) {
      logger.error('Permission error:', e);
      return false;
    }
  }, []);

  /* -------------------- Helpers -------------------- */

  const getTimestampedFileName = () => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    return `${AUDIO_FILE_PREFIX}${ts}.${AUDIO_FILE_EXTENSION}`;
  };

  /* -------------------- Recording -------------------- */

  /* -------------------- Recording -------------------- */

  const startRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      try {
        setTranscription('');

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        recordingStartedAt.current = Date.now();
        setIsRecordingButton(true);

        const fileName = getTimestampedFileName();

        if (Platform.OS === 'android') {
           const audioSet = {
            AudioSamplingRate: 44100,
            AudioChannels: 2,
            AudioQuality: 'high',
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
          };
          // Android uses nitro-sound
          await SoundRecorder.startRecorder(undefined, audioSet);
        } else {
          // --- iOS Native AudioRecorderModule ---
          // Start (includes atomic session configuration)
          const path = await NativeModules.AudioRecorderModule.startRecording(fileName);
          console.log('iOS Native Recorder Started at:', path);
        }
      } catch (e) {
        logger.error('Start recording failed:', e);
        Alert.alert('Recording Error', `Failed to start: ${e.message}`);
        setIsRecordingButton(false);
      }
    },
    [requestPermissions],
  );

  const stopRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      if (!isRecordingButton) return;

      // Prevent instant stop
      if (Date.now() - recordingStartedAt.current < 500) {
        logger.warn('Recording too short, ignoring stop');
        return;
      }

      try {
        setIsRecordingButton(false);
        let filePath;

        if (Platform.OS === 'android') {
            const result = await SoundRecorder.stopRecorder();
            if (!result || typeof result !== 'string') throw new Error('Invalid recorder output');
            filePath = result.startsWith('file://') ? result.replace('file://', '') : result;
        } else {
            // iOS Native Module returns path directly
            filePath = await NativeModules.AudioRecorderModule.stopRecording();
            console.log('iOS Native Recorder Stopped, file:', filePath);
        }

        const exists = await RNFS.exists(filePath);
        if (!exists) {
          throw new Error('Recorded file not found');
        }

        const uploadResult = await uploadAudioToGladia(filePath);
        await startTranscription(uploadResult?.audio_url);
        
      } catch (e) {
        logger.error('Stop recording failed:', e);
        Alert.alert('Processing Error', `Failed to process: ${e.message}`);
      } finally {
        setIsRecordingButton(false);
      }
    },
    [isRecordingButton, uploadAudioToGladia, startTranscription],
  );

  /* -------------------- Upload -------------------- */

  const uploadAudioToGladia = useCallback(async (filePath) => {
    const fileUri = Platform.OS === 'android' ? `file://${filePath}` : filePath;

    const formData = new FormData();
    formData.append('audio', {
      uri: fileUri,
      type: `audio/${AUDIO_FILE_EXTENSION}`,
      name: filePath.split('/').pop(),
    });

    const res = await fetch(GLADIA_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-gladia-key': GLADIA_API_KEY,
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    return json;
  }, []);

  /* -------------------- Transcription -------------------- */

  const startTranscription = useCallback(
    async (url) => {
      setWaitingForTranslation(true);

      const response = await fetch(GLADIA_TRANSCRIPTION_URL, {
        method: 'POST',
        headers: {
          'x-gladia-key': GLADIA_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: url,
          audio_to_llm: true,
          language: 'sa',
          detect_language: false,
          audio_to_llm_config: {
            prompts: [`${get(learnGeeta, 'data.shloke')}`],
          },
        }),
      }).then((r) => r.json());

      if (response?.result_url) {
        await pollForResult(response.result_url);
      }
    },
    [learnGeeta],
  );

  const pollForResult = useCallback(
    async (url) => {
      const MAX_RETRIES = 30; // ~20 * interval = total wait time
      let attempts = 0;
      let isActive = true;

      try {
        while (isActive && attempts < MAX_RETRIES) {
          const res = await fetch(url, {
            headers: { 'x-gladia-key': GLADIA_API_KEY },
          }).then((r) => r.json());

          if (res?.status === 'done') {
            setWaitingForTranslation(false);

            const original =
              res?.result?.audio_to_llm?.results?.[0]?.results?.prompt || '';
            const spoken =
              res?.result?.audio_to_llm?.results?.[0]?.results?.response || '';

            const score = (
              stringSimilarity.compareTwoStrings(original, spoken) * 100
            ).toFixed(2);

            setTranscription(score);
            handleSaveResult({
              result: score,
              media: get(learnGeeta, 'data.media.id', ''),
            });

            return; // ✅ Exit cleanly
          }

          attempts += 1;
          await new Promise((r) => setTimeout(r, TRANSCRIPTION_POLL_INTERVAL));
        }

        throw new Error('Transcription timeout');
      } catch (err) {
        logger.error('Polling failed:', err);
        setWaitingForTranslation(false);
      }
    },
    [learnGeeta, handleSaveResult],
  );

  return {
    isRecordingButton,
    transcription,
    waitingForTranslation,
    startRecording,
    stopRecording,
    resetTranscription: () => setTranscription(''),
  };
};
