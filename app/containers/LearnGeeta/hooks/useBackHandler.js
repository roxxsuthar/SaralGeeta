import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import { useNavigation } from '@react-navigation/native';

export const useBackHandler = (audio) => {
  const navigation = useNavigation();

  useEffect(() => {
    const onBackPress = () => {
      if (audio) {
        audio.stop();
        audio.release();
      }
      SoundRecorder.stop();
      navigation.goBack();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [navigation, audio]);
};
