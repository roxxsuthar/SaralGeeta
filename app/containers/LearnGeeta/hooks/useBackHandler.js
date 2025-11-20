import { useEffect } from 'react';
import SoundRecorder from 'react-native-sound-recorder';

export const useBackHandler = (audio) => {
  // Only cleanup when component unmounts
  // Don't handle back button - let global withBack HOC do it
  useEffect(() => {
    return () => {
      // Cleanup when leaving screen
      try {
        if (audio) {
          audio.stop();
          audio.release();
        }
        SoundRecorder.stop();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, [audio]);
};
