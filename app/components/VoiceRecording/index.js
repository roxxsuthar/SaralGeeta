import logger from '../../utils/logger';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, View, Text, PermissionsAndroid, Platform } from 'react-native';
import AudioRecord from 'react-native-audio-record';

const VoiceRecording = () => {
  const [recording, setRecording] = useState(false);
  const [path, setPath] = useState(null);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'App needs access to your microphone to record audio',
            buttonPositive: 'OK',
          },
        );
      }
    };

    requestPermission();

    // Configure AudioRecord
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'hello.wav',
    });
  }, []);

  const startRecording = async () => {
    setRecording(true);
    await AudioRecord.start();
    logger.log('Recording started');
  };

  const stopRecording = async () => {
    const audioFile = await AudioRecord.stop();
    setRecording(false);
    setPath(audioFile);
    logger.log('Recording stopped, saved at:', audioFile);
    sendToGladia(audioFile);
  };

  const sendToGladia = async (audioPath) => {
    try {
      const audioFile = {
        uri: `file://${audioPath}`,
        type: 'audio/wav',
        name: 'voice.wav',
      };

      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await axios.post(
        'https://api.gladia.io/speech-to-text',
        formData,
        {
          headers: {
            Authorization: 'Bearer dffdb901-d2e4-4892-9c42-4291476ba4c4',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const { data } = response;
      setTranscription(data.text);
      logger.log('Transcription:', data.text);
    } catch (error) {
      logger.error('Error sending audio to Gladia:', error);
    }
  };

  return (
    <View>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {path && <Text>Saved at: {path}</Text>}
      {transcription && <Text>Transcription: {transcription}</Text>}
    </View>
  );
};

export default VoiceRecording;
