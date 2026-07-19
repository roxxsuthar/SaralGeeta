import { useState, useCallback, useRef } from 'react';
import { Platform, Alert, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import SoundRecorder, {
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
import {
  AUDIO_FILE_EXTENSION,
  AUDIO_FILE_PREFIX,
} from '../../../constants/constants';

export const useBhagwanRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState(null);
  const recordingStartedAt = useRef(0);

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

  const getTimestampedFileName = () => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    return `${AUDIO_FILE_PREFIX}${ts}.${AUDIO_FILE_EXTENSION}`;
  };

  const startRecording = useCallback(async () => {
    try {
      setAudioPath(null);

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      recordingStartedAt.current = Date.now();
      setIsRecording(true);

      const fileName = getTimestampedFileName();

      if (Platform.OS === 'android') {
        const audioSet = {
          AudioSamplingRate: 44100,
          AudioChannels: 2,
          AudioQuality: 'high',
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
        };
        await SoundRecorder.startRecorder(undefined, audioSet);
      } else {
        await NativeModules.AudioRecorderModule.startRecording(fileName);
      }
    } catch (e) {
      setIsRecording(false);
    }
  }, [requestPermissions]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return null;

    if (Date.now() - recordingStartedAt.current < 500) {
      return null;
    }

    try {
      setIsRecording(false);
      let filePath;

      if (Platform.OS === 'android') {
        const result = await SoundRecorder.stopRecorder();
        if (!result || typeof result !== 'string') throw new Error('Invalid recorder output');
        filePath = result.startsWith('file://') ? result.replace('file://', '') : result;
      } else {
        filePath = await NativeModules.AudioRecorderModule.stopRecording();
      }

      const exists = await RNFS.exists(filePath);
      if (!exists) {
        throw new Error('Recorded file not found');
      }

      setAudioPath(filePath);
      return filePath;
    } catch (e) {
      setIsRecording(false);
      return null;
    }
  }, [isRecording]);

  const clearAudio = useCallback(() => {
    setAudioPath(null);
  }, []);

  return {
    isRecording,
    audioPath,
    startRecording,
    stopRecording,
    clearAudio,
    setAudioPath,
  };
};
