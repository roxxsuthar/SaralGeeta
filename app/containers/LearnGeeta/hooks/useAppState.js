import { useEffect } from 'react';
import { AppState } from 'react-native';
import Sound from 'react-native-sound';

export const useAppState = (
  audio,
  isAudioReady,
  isIntroVideoPlayed,
  isVideoReady,
  isLoading,
  isButton,
  playAudio,
) => {
  useEffect(() => {
    Sound.setCategory('Playback', true);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        if (audio) {
          audio.pause();
        }
      } else if (nextAppState === 'active') {
        if (
          audio &&
          isAudioReady &&
          isIntroVideoPlayed &&
          isVideoReady &&
          !isLoading &&
          !isButton
        ) {
          playAudio();
        }
      }
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateSubscription.remove();
    };
  }, [
    audio,
    isAudioReady,
    isIntroVideoPlayed,
    isVideoReady,
    isLoading,
    isButton,
    playAudio,
  ]);
};
