import logger from '../../../utils/logger';
import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import SoundRecorder from 'react-native-sound-recorder';
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

export const useRecording = (learnGeeta, handleSaveResult) => {
  const [isRecordingButton, setIsRecordingButton] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [waitingForTranslation, setWaitingForTranslation] = useState('');

  const REQUIRED_PERMISSIONS = Platform.select({
    android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
    ios: [PERMISSIONS.IOS.MICROPHONE],
  });

  const requestPermissions = useCallback(async () => {
    try {
      const checkResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => check(permission)),
      );

      if (checkResults.every((result) => result === RESULTS.GRANTED)) {
        logger.log('All permissions already granted');
        return true;
      }

      const requestResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => request(permission)),
      );

      const hasBlocked = requestResults.some(
        (result) => result === RESULTS.BLOCKED || result === RESULTS.DENIED,
      );

      if (hasBlocked) {
        Alert.alert(
          'Permissions Required',
          'Please enable permissions from app settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
        return false;
      }

      const allGranted = requestResults.every(
        (result) => result === RESULTS.GRANTED,
      );

      return allGranted;
    } catch (err) {
      logger.warn('Permission request error:', err);
      return false;
    }
  }, []);

  const getTimestampedFileName = useCallback((extension) => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    return `${AUDIO_FILE_PREFIX}${timestamp}.${extension}`;
  }, []);

  const uploadAudioToGladia = useCallback(async (filePath) => {
    try {
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('File not found at the specified path.');
      }

      const fileUri =
        Platform.OS === 'android' ? `file://${filePath}` : filePath;

      const formData = new FormData();
      formData.append('audio', {
        uri: fileUri,
        type: `audio/${AUDIO_FILE_EXTENSION}`,
        name: filePath.split('/').pop(),
      });

      const headers = {
        'Content-Type': 'multipart/form-data',
        'x-gladia-key': GLADIA_API_KEY,
      };

      const response = await fetch(GLADIA_UPLOAD_URL, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload audio file.');
      }

      return result;
    } catch (error) {
      logger.error('Error uploading audio file:', error.message);
      throw error;
    }
  }, []);

  const startTranscription = useCallback(
    async (url) => {
      const requestData = {
        audio_url: url,
        audio_to_llm: true,
        language: 'sa',
        detect_language: false,
        audio_to_llm_config: {
          prompts: [`${get(learnGeeta, 'data.shloke')}`],
        },
      };

      const headers = {
        'x-gladia-key': GLADIA_API_KEY,
        'Content-Type': 'application/json',
      };

      setWaitingForTranslation(true);

      try {
        const initialResponse = await fetch(GLADIA_TRANSCRIPTION_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestData),
        }).then((res) => res.json());

        if (initialResponse.result_url) {
          await pollForResult(initialResponse.result_url, headers);
        }
      } catch (error) {
        logger.error('Transcription error:', error);
        setWaitingForTranslation(false);
      }
    },
    [learnGeeta],
  );

  const pollForResult = useCallback(
    async (resultUrl, headers) => {
      while (true) {
        try {
          const pollResponse = await fetch(resultUrl, { headers }).then((res) =>
            res.json(),
          );

          if (pollResponse.status === 'done') {
            setWaitingForTranslation(false);

            const audioToLlmResults = pollResponse.result.audio_to_llm;
            const textOriginal = audioToLlmResults?.results[0]?.results?.prompt;
            const textTranslated =
              audioToLlmResults?.results[0]?.results?.response;

            const similarity = stringSimilarity.compareTwoStrings(
              textOriginal,
              textTranslated,
            );
            const similarityPercentage = (similarity * 100).toFixed(2);

            setTranscription(similarityPercentage);

            const obj = {
              result: similarityPercentage,
              media: get(learnGeeta, 'data.media.id', ''),
            };
            handleSaveResult(obj);
            break;
          } else {
            await new Promise((resolve) =>
              setTimeout(resolve, TRANSCRIPTION_POLL_INTERVAL),
            );
          }
        } catch (error) {
          logger.error('Polling error:', error);
          setWaitingForTranslation(false);
          break;
        }
      }
    },
    [learnGeeta, handleSaveResult],
  );

  const startRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      try {
        setTranscription('');
        
        // Start playing the video from beginning
        videoRef.current?.seek(0);
        setIsVideoPlaying(false); // This will unpause the video
        
        setIsRecordingButton(true);

        const hasPermissions = await requestPermissions();
        if (!hasPermissions) {
          logger.error('Permissions not granted.');
          setIsRecordingButton(false);
          videoRef.current?.pause();
          return;
        }

        const fileName = getTimestampedFileName(AUDIO_FILE_EXTENSION);
        const path = Platform.select({
          ios: fileName,
          android: `${RNFS.DocumentDirectoryPath}/${fileName}`,
        });

        await SoundRecorder.start(path);
        logger.log('Recording successfully started at:', path);
      } catch (error) {
        logger.error('Error starting recorder:', error.message);
        setIsRecordingButton(false);
        videoRef.current?.pause();
      }
    },
    [requestPermissions, getTimestampedFileName],
  );

  const stopRecording = useCallback(
    async (videoRef, setIsVideoPlaying) => {
      // Pause the video immediately
      videoRef.current?.pause();
      setIsVideoPlaying(true); // This will pause the video

      if (!isRecordingButton) {
        logger.warn('Recorder is not active. Cannot stop recording.');
        return;
      }

      try {
        const result = await SoundRecorder.stop();
        if (!result) {
          setIsRecordingButton(false);
          return;
        }

        const cleanedPath = result?.path;
        const fileExists = await RNFS.exists(cleanedPath);

        if (!fileExists) {
          throw new Error('File not found at the specified path.');
        }

        const uploadResult = await uploadAudioToGladia(cleanedPath);
        await startTranscription(uploadResult?.audio_url);
        setIsRecordingButton(false);
      } catch (error) {
        logger.error('Error stopping recording:', error);
        setIsRecordingButton(false);
      }
    },
    [isRecordingButton, uploadAudioToGladia, startTranscription],
  );

  const resetTranscription = useCallback(() => {
    setTranscription('');
  }, []);

  return {
    isRecordingButton,
    transcription,
    waitingForTranslation,
    startRecording,
    stopRecording,
    resetTranscription,
  };
};
