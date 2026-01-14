import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { useAudioRecorder, RecordingPresets, setAudioModeAsync, getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import stringSimilarity from 'string-similarity';
import { get } from 'lodash';
import {
  GLADIA_API_KEY,
  GLADIA_UPLOAD_URL,
  GLADIA_TRANSCRIPTION_URL,
  AUDIO_FILE_EXTENSION,
  TRANSCRIPTION_POLL_INTERVAL,
  AUDIO_FILE_PREFIX,
} from '../../../constants/constants';

export const useRecording = (learnGeeta, handleSaveResult, setIsVideoMounted) => {
  const [isRecordingButton, setIsRecordingButton] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [waitingForTranslation, setWaitingForTranslation] = useState(false);

  const recordingStartedAt = useRef(0);
  
  // expo-audio recorder hook
  const audioRecorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      // status listener if needed
    }
  );

  // Initialize audio mode for iOS compatibility
  useEffect(() => {
    const initAudioMode = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
          staysActiveInBackground: false,
          interruptionMode: 'mixWithOthers', // Allow video to play while recording
        });
      } catch (error) {
        // Silent fail for mode init
      }
    };
    initAudioMode();
  }, []);

  /* -------------------- Permissions -------------------- */

  const REQUIRED_PERMISSIONS = Platform.select({
    android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
    ios: [PERMISSIONS.IOS.MICROPHONE],
  });

  const requestPermissions = useCallback(async () => {
    try {
      // First check with react-native-permissions for external consistency
      const results = await Promise.all(
        REQUIRED_PERMISSIONS.map((p) => check(p)),
      );

      if (results.every((r) => r === RESULTS.GRANTED)) {
        // Double check with expo-audio native response
        const expoStatus = await getRecordingPermissionsAsync();
        if (expoStatus.granted) {
          return true;
        }
      }

      // Request using expo-audio native mechanism
      const expoResult = await requestRecordingPermissionsAsync();
      if (expoResult.granted) {
        return true;
      }

      // If expo fails, fallback to react-native-permissions request
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
      return false;
    }
  }, []);

  /* -------------------- Helpers -------------------- */

  const getTimestampedFileName = () => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    return `${AUDIO_FILE_PREFIX}${ts}.${AUDIO_FILE_EXTENSION}`;
  };

  /* -------------------- Recording -------------------- */

  const startRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      try {
        setTranscription('');

        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        // 1. Pause video
        videoRef.current?.seek(0);
        setIsVideoPlaying(false);

        recordingStartedAt.current = Date.now();
        setIsRecordingButton(true);

        // 2. Hardware release delay (iOS)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 3. Configure Audio session
        try {
          await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
            staysActiveInBackground: false,
            interruptionMode: 'mixWithOthers',
          });
        } catch (modeError) {
          // Ignore
        }

        // 4. Prepare and start
        try {
          await audioRecorder.prepareToRecordAsync();
        } catch (prepError) {
          // One retry for robustness
          await new Promise((resolve) => setTimeout(resolve, 500));
          await audioRecorder.prepareToRecordAsync();
        }
        
        audioRecorder.record();

        // 5. Resume video (muted)
        setTimeout(() => {
          setIsVideoPlaying(true);
        }, 300);
      } catch (e) {
        Alert.alert('Recording Error', `Failed to start recording: ${e.message}`);
        setIsRecordingButton(false);
        setIsVideoPlaying(true);
      }
    },
    [requestPermissions, audioRecorder],
  );

  const stopRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      if (!isRecordingButton) return;

      const duration = Date.now() - recordingStartedAt.current;
      if (duration < 1000) {
        Alert.alert('Recording too short', 'Please record for at least 1 second');
        setIsRecordingButton(false);
        return;
      }

      try {
        setIsRecordingButton(false);
        await audioRecorder.stop();
        
        const uri = audioRecorder.uri;
        if (!uri) throw new Error('No recording URI');

        let filePath = uri.replace('file://', '');

        const exists = await RNFS.exists(filePath);
        if (!exists) throw new Error('Recorded file not found');

        const fileStats = await RNFS.stat(filePath);
        if (fileStats.size < 100) {
          throw new Error('Recorded file is empty or too small. Please check microphone.');
        }

        const uploadResult = await uploadAudioToGladia(filePath);
        await startTranscription(uploadResult?.audio_url);
      } catch (e) {
        Alert.alert('Processing Error', `Failed to process recording: ${e.message}`);
      } finally {
        setIsRecordingButton(false);
        setIsVideoPlaying(true);
      }
    },
    [isRecordingButton, audioRecorder, uploadAudioToGladia, startTranscription],
  );

  /* -------------------- Upload -------------------- */

  const uploadAudioToGladia = useCallback(async (filePath) => {
    try {
      // Ensure proper file URI format
      let fileUri = filePath;
      if (!fileUri.startsWith('file://')) {
        fileUri = `file://${filePath}`;
      }

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
      
      if (!res.ok) {
        throw new Error(json.message || 'Upload failed');
      }

      return json;
    } catch (error) {
      throw error;
    }
  }, []);

  /* -------------------- Transcription -------------------- */

  const startTranscription = useCallback(
    async (url) => {
      try {
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
        } else {
          throw new Error('No result URL in transcription response');
        }
      } catch (error) {
        setWaitingForTranslation(false);
        Alert.alert('Transcription Error', 'Failed to start transcription');
      }
    },
    [learnGeeta],
  );

  const pollForResult = useCallback(
    async (url) => {
      const MAX_RETRIES = 30;
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

            return;
          }

          attempts += 1;
          await new Promise((r) => setTimeout(r, TRANSCRIPTION_POLL_INTERVAL));
        }

        throw new Error('Transcription timeout');
      } catch (err) {
        setWaitingForTranslation(false);
        Alert.alert('Timeout', 'Transcription took too long');
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