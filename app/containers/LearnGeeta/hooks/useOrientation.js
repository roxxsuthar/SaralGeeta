import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

export const useOrientation = () => {
  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
};
