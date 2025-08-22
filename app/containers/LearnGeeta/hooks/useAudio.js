import { useState, useCallback, useEffect } from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { get } from 'lodash';
import { AUDIO_VOLUME, AUDIO_FILE_SUFFIX } from '../../../constants/constants';

Sound.setCategory('Playback');

export const useAudio = (learnGeeta) => {
  const [audio, setAudio] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const loadAudio = useCallback(async () => {
    if (isAudioLoading || !learnGeeta) return;

    setIsAudioLoading(true);

    try {
      const audioUrl = get(learnGeeta, 'data.media.audio');
      if (!audioUrl) {
        throw new Error('No audio URL available');
      }

      const fileName = audioUrl.split('/').pop();
      const uniqueFileName = `${get(learnGeeta, 'data.id')}${AUDIO_FILE_SUFFIX}.${fileName.slice(-3)}`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;

      const fileExists = await RNFS.exists(localPath);

      if (!fileExists) {
        const downloadResult = await RNFS.downloadFile({
          fromUrl: audioUrl,
          toFile: localPath,
        }).promise;

        if (downloadResult.statusCode !== 200) {
          throw new Error('Failed to download audio file');
        }
      }

      if (audio) {
        audio.release();
      }

      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          setIsAudioLoading(false);
          return;
        }

        sound.setVolume(AUDIO_VOLUME);
        setAudio(sound);
        setIsAudioReady(true);
        setIsAudioLoading(false);
      });
    } catch (err) {
      console.error('Audio loading error:', err);
      setIsAudioLoading(false);
      setIsAudioReady(false);
    }
  }, [learnGeeta, audio, isAudioLoading]);

  const playAudio = useCallback(() => {
    if (!audio || !isAudioReady) {
      console.log('Audio not ready to play');
      return;
    }
    if (audio.isPlaying()) {
      return;
    }

    audio.play((success) => {
      if (!success) {
        console.log('Audio playback failed');
      }
    });
  }, [audio, isAudioReady]);

  const pauseAudio = useCallback(() => {
    if (audio && audio.isPlaying()) {
      audio.pause();
    }
  }, [audio]);

  const stopAudio = useCallback(() => {
    if (audio) {
      audio.stop();
    }
  }, [audio]);

  const releaseAudio = useCallback(() => {
    if (audio) {
      audio.release();
      setAudio(null);
      setIsAudioReady(false);
    }
  }, [audio]);

  useEffect(() => {
    if (learnGeeta) {
      loadAudio();
    }

    return () => {
      releaseAudio();
    };
  }, [learnGeeta]);

  return {
    audio,
    isAudioReady,
    isAudioLoading,
    playAudio,
    pauseAudio,
    stopAudio,
    releaseAudio,
    loadAudio,
  };
};
