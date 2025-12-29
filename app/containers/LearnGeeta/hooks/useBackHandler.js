import { useEffect } from 'react';
import SoundRecorder from 'react-native-nitro-sound';

export const useBackHandler = () => {
  // Only cleanup when component unmounts
  // Don't handle back button - let global withBack HOC do it
  useEffect(() => {
    return () => {
      // Cleanup when leaving screen
      try {
        SoundRecorder.stopRecorder();
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, [audio]);
};
