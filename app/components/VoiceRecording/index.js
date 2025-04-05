import axios from 'axios';
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const VoiceRecording = () => {
  const [recording, setRecording] = useState(false);
  const [path, setPath] = useState(null);
  const [transcription, setTranscription] = useState('');

  const startRecording = async () => {
    const path = 'hello.m4a'; // Specify path for the recorded audio
    const result = await audioRecorderPlayer.startRecorder(path);
    setPath(result);
    setRecording(true);
    console.log('Recording started');
  };

  const stopRecording = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    console.log('Recording stopped, saved at:', result);
    sendToGladia(result);
  };

  const sendToGladia = async (audioPath) => {
    try {
      const audioFile = {
        uri: audioPath,
        type: 'audio/m4a',
        name: 'voice.m4a',
      };

      const formData = new FormData();
      formData.append('audio', audioFile);

      // Replace with your Gladia API endpoint and API key
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
      setTranscription(data.text); // assuming Gladia returns a text property with the transcribed text
      console.log('Transcription:', data.text);
    } catch (error) {
      console.error('Error sending audio to Gladia:', error);
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
