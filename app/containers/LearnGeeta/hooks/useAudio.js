import logger from '../../../utils/logger';
import { useState, useCallback, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { get } from 'lodash';
import { AUDIO_VOLUME, AUDIO_FILE_SUFFIX } from '../../../constants/constants';

Sound.setCategory('Playback');

export const useAudio = (learnGeeta) => {
  const [audio, setAudio] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef(null);

  const loadAudio = useCallback(async () => {
    if (!learnGeeta) return;

    const audioUrl = get(learnGeeta, 'data.media.audio');
    if (!audioUrl) {
      logger.log('Audio URL not available yet, skipping load');
      setIsAudioReady(false);
      return;
    } else {
      console.log('-----', get(learnGeeta, 'data.media'));
    }

    setIsAudioLoading(true);

    try {
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

      if (audioRef.current) {
        try {
          audioRef.current.release();
        } catch (err) {
          logger.error('Error releasing previous audio:', err);
        }
      }

      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          logger.error('Failed to load sound:', error);
          setIsAudioLoading(false);
          setIsAudioReady(false);
          return;
        }

        sound.setVolume(AUDIO_VOLUME);
        audioRef.current = sound;
        setAudio(sound);
        setIsAudioReady(true);
        setIsAudioLoading(false);
      });
    } catch (err) {
      logger.error('Audio loading error:', err);
      setIsAudioLoading(false);
      setIsAudioReady(false);
    }
  }, [learnGeeta]);

  const playAudio = useCallback(() => {
    if (!audio || !isAudioReady) {
      return;
    }
    if (audio.isPlaying()) {
      return;
    }

    try {
      audio.play((success) => {
        if (!success) {
          logger.log('Audio playback failed');
        }
      });
    } catch (err) {
      logger.error('Error playing audio:', err);
    }
  }, [audio, isAudioReady]);

  const pauseAudio = useCallback(() => {
    if (audio && audio.isPlaying()) {
      try {
        audio.pause();
      } catch (err) {
        logger.error('Error pausing audio:', err);
      }
    }
  }, [audio]);

  const stopAudio = useCallback(() => {
    if (audio) {
      try {
        audio.stop();
      } catch (err) {
        logger.error('Error stopping audio:', err);
      }
    }
  }, [audio]);

  const releaseAudio = useCallback(() => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      try {
        currentAudio.release();
      } catch (err) {
        logger.error('Error releasing audio:', err);
      }
      audioRef.current = null;
      setAudio(null);
      setIsAudioReady(false);
    }
  }, []);

  useEffect(() => {
    const audioUrl = get(learnGeeta, 'data.media.audio');
    const shlokId = get(learnGeeta, 'data.id');

    if (!shlokId || !audioUrl) {
      return;
    }

    loadAudio();

    return () => {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        try {
          currentAudio.release();
        } catch (err) {
          logger.error('Error releasing audio:', err);
        }
        audioRef.current = null;
        setAudio(null);
        setIsAudioReady(false);
      }
    };
  }, [get(learnGeeta, 'data.id'), get(learnGeeta, 'data.media.audio')]);

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
