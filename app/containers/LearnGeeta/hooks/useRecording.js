import { useState, useCallback, useRef, useEffect } from 'react';
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
// stringSimilarity removed — comparison is now done via Gladia audio_to_llm
import { get } from 'lodash';
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
    async () => {
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
          await NativeModules.AudioRecorderModule.startRecording(fileName);
        }
      } catch (e) {
        setIsRecordingButton(false);
      }
    },
    [requestPermissions],
  );

  const stopRecording = useCallback(
    async () => {
      if (!isRecordingButton) return;

      // Prevent instant stop
      if (Date.now() - recordingStartedAt.current < 500) {
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
        }

        const exists = await RNFS.exists(filePath);
        if (!exists) {
          throw new Error('Recorded file not found');
        }

        const uploadResult = await uploadAudioToGladia(filePath);
        await startTranscription(uploadResult?.audio_url);

      } catch (e) {


      } finally {
        setIsRecordingButton(false);
      }
    },
    [isRecordingButton, uploadAudioToGladia, startTranscription],
  );

  /* -------------------- Upload -------------------- */

  const uploadAudioToGladia = useCallback(async (filePath) => {
    const fileUri = Platform.OS === 'android' ? `file://${filePath}` : filePath;

    // ✅ Gladia accepts audio/mp4 for both .m4a and .mp4 containers
    const mimeType = Platform.OS === 'android' ? 'audio/mp4' : 'audio/x-m4a';

    const formData = new FormData();
    formData.append('audio', {
      uri: fileUri,
      type: mimeType,
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

      // Build the reference shlok text from shloke_parts or fallback to shloke
      const shlokeParts = get(learnGeeta, 'data.shloke_parts', []);
      const referenceShlok = shlokeParts.length
        ? shlokeParts.join(' ')
        : get(learnGeeta, 'data.shloke', '');

      try {
        const response = await fetch(GLADIA_TRANSCRIPTION_URL, {
          method: 'POST',
          headers: {
            'x-gladia-key': GLADIA_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio_url: url,
            // ✅ Correct Gladia v2 language format
            language_config: {
              languages: ['sa'],
            },
            // ✅ Let Gladia's LLM do the comparison instead of manual string similarity
            audio_to_llm: true,
            audio_to_llm_config: {
              prompts: [
                `You are a Sanskrit recitation evaluator. The user recited a shlok. Compare what they said with this reference shlok text: "${referenceShlok}". Return ONLY a valid JSON object with a single key "score" — a number from 0 to 100 representing how accurately the speech matches the reference. 100 means perfect match, 0 means completely wrong. Consider phonetic similarity for Sanskrit pronunciation. Example: {"score": 87}`,
              ],
            },
          }),
        }).then((r) => r.json());

        if (response?.result_url) {
          // Use ref to avoid stale closure of pollForResult
          await (pollForResultRef.current || pollForResult)(response.result_url);
        } else {
          // ✅ Safety: reset spinner if Gladia didn't return a result_url
          setWaitingForTranslation(false);
        }
      } catch (err) {
        setWaitingForTranslation(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learnGeeta], // pollForResult accessed via ref to avoid stale closure
  );

  // Use a ref so startTranscription always calls the latest pollForResult (fixes stale closure)
  const pollForResultRef = useRef(null);

  const pollForResult = useCallback(
    async (url) => {
      const MAX_RETRIES = 30;
      let attempts = 0;

      try {
        while (attempts < MAX_RETRIES) {
          const res = await fetch(url, {
            headers: { 'x-gladia-key': GLADIA_API_KEY },
          }).then((r) => r.json());

          // ✅ Handle Gladia error status immediately (previously ignored!)
          if (res?.status === 'error') {
            const errMsg = res?.error_message || res?.message || JSON.stringify(res);
            setWaitingForTranslation(false);
            return;
          }

          if (res?.status === 'done') {
            setWaitingForTranslation(false);

            // ✅ Debug: show exactly what Gladia returned
            const audioToLlm = res?.result?.audio_to_llm;

            // ✅ Extract the LLM comparison result from Gladia V2
            let llmRaw = '';
            // Gladia API sometimes uses 'results' instead of 'result' inside the array object!
            const llmResultObj = audioToLlm?.results?.[0]?.result || audioToLlm?.results?.[0]?.results;

            if (typeof llmResultObj === 'string') {
              llmRaw = llmResultObj;
            } else if (llmResultObj?.response) {
              // Gladia V2 wraps response in { response: "..." }
              llmRaw = llmResultObj.response;
            } else if (llmResultObj) {
              llmRaw = JSON.stringify(llmResultObj);
            }


            let score = '0.00';
            try {
              const cleaned = String(llmRaw)
                .replace(/```json/gi, '')
                .replace(/```/g, '')
                .trim();
              const parsed = JSON.parse(cleaned);
              const rawScore = Number(parsed?.score ?? 0);
              score = Math.min(100, Math.max(0, rawScore)).toFixed(2);
            } catch {
              // Regex fallback: extract any number from the response
              const match = String(llmRaw).match(/(\d+(\.\d+)?)/);
              if (match) {
                score = Math.min(100, Math.max(0, parseFloat(match[1]))).toFixed(2);
              }
            }

            setTranscription(score);
            handleSaveResult({
              result: score,
              media: get(learnGeeta, 'data.media.id', ''),
            });

            return;
          }

          // Status is 'queued' or 'processing' — keep polling
          attempts += 1;
          await new Promise((r) => setTimeout(r, TRANSCRIPTION_POLL_INTERVAL));
        }

        throw new Error('Transcription timed out after 30 seconds');
      } catch (err) {
        setWaitingForTranslation(false);
      }
    },
    [handleSaveResult, learnGeeta],
  );

  // Keep ref in sync so startTranscription always uses latest version
  useEffect(() => {
    pollForResultRef.current = pollForResult;
  }, [pollForResult]);

  return {
    isRecordingButton,
    transcription,
    waitingForTranslation,
    startRecording,
    stopRecording,
    resetTranscription: () => setTranscription(''),
  };
};
