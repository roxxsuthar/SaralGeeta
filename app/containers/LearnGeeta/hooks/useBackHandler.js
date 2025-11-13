import { useEffect, useCallback } from 'react';
import { BackHandler } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const useBackHandler = (audio) => {
  const navigation = useNavigation();

  const handleBackPress = useCallback(() => {
    try {
      // Stop and cleanup audio
      if (audio) {
        audio.stop().catch(() => {});
        audio.release().catch(() => {});
      }

      // Stop recording if active
      SoundRecorder.stop().catch(() => {});

      // Navigate back
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true; // Prevent default behavior
      }
      return false; // Let default behavior handle it
    } catch (error) {
      console.error('Back handler error:', error);
      navigation.goBack();
      return true;
    }
  }, [navigation, audio]);

  // Handle hardware back button
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => {
      subscription.remove();
    };
  }, [handleBackPress]);

  // Handle screen focus/blur
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup when leaving screen
        try {
          if (audio) {
            audio.stop().catch(() => {});
            audio.release().catch(() => {});
          }
          SoundRecorder.stop().catch(() => {});
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
    }, [audio]),
  );
};
