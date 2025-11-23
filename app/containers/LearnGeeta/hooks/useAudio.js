import logger from '../../../utils/logger';
import { useState, useCallback, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import { get } from 'lodash';

Sound.setCategory('Playback');

// Simplified hook - only creates audio object for recording cleanup, no playback
export const useAudio = (learnGeeta) => {
  const [audio, setAudio] = useState(null);
  const audioRef = useRef(null);

  const createAudioObject = useCallback(() => {
    // Create a simple audio object for recording to stop/release
    // No actual audio loading or playback
    const audioUrl = get(learnGeeta, 'data.media.audio');

    if (!audioUrl) {
      return;
    }

    // Release previous audio if exists
    if (audioRef.current) {
      try {
        audioRef.current.release();
      } catch (err) {
        logger.error('Error releasing previous audio:', err);
      }
    }

    // Create a dummy sound object for recording cleanup
    const sound = new Sound('', '', () => {
      // No playback, just for object creation
    });

    audioRef.current = sound;
    setAudio(sound);
  }, [learnGeeta]);

  useEffect(() => {
    const audioUrl = get(learnGeeta, 'data.media.audio');
    const shlokId = get(learnGeeta, 'data.id');

    if (!shlokId || !audioUrl) {
      return;
    }

    createAudioObject();

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
      }
    };
  }, [get(learnGeeta, 'data.id'), get(learnGeeta, 'data.media.audio')]);

  return {
    audio, // Only return audio object for recording cleanup
  };
};
