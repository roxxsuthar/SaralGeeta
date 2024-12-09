import React, { useRef, useEffect, useState } from 'react';
import { View, StatusBar, Dimensions, AppState } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectLearnGeeta from './selectors';
import { VIDEOS } from '../../constants';
import styles from './styles';

Sound.setCategory('Playback'); // Allow audio to play in the background

// function LearnGeeta() {
//   const videoRef = useRef(null);
//   const [audio, setAudio] = useState(null);
//   const [isAudioReady, setIsAudioReady] = useState(false);
//   const { width, height } = Dimensions.get('window');
//   const aspectRatio = width / height;

//   useEffect(() => {
//     // Lock orientation to landscape
//     Orientation.lockToLandscape();

//     // Configure audio settings for mixing
//     Sound.setCategory('Playback', true);

//     // Load and play audio
//     loadAudio();

//     return () => {
//       Orientation.unlockAllOrientations();
//       if (audio) {
//         audio.stop();
//         audio.release();
//       }
//     };
//   }, []);

//   const loadAudio = async () => {
//     const localPath = `${RNFS.DocumentDirectoryPath}/sound.mp3`;

//     try {
//       const fileExists = await RNFS.exists(localPath);
//       if (!fileExists) {
//         await RNFS.downloadFile({
//           fromUrl:
//             'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//           toFile: localPath,
//         }).promise;
//       }

//       const sound = new Sound(localPath, '', (error) => {
//         if (error) {
//           console.error('Error loading audio:', error);
//           return;
//         }

//         // Configure audio settings
//         sound.setVolume(1.0);
//         sound.setNumberOfLoops(-1); // Loop indefinitely
//         setAudio(sound);
//         setIsAudioReady(true);
//       });
//     } catch (err) {
//       console.error('Error downloading or loading audio:', err);
//     }
//   };

//   const playAudio = () => {
//     if (audio) {
//       audio.play((success) => {
//         if (!success) {
//           console.error('Audio playback failed.');
//         }
//       });
//     }
//   };

//   // Start playing audio as soon as it's ready
//   useEffect(() => {
//     if (isAudioReady) {
//       playAudio();
//     }
//   }, [isAudioReady]);

//   return (
//     <SafeAreaView style={styles.container} edges={['left', 'right']}>
//       <StatusBar
//         barStyle="light-content"
//         translucent
//         backgroundColor="transparent"
//       />
//       <LinearGradient
//         colors={['#ff8c00', '#ff0080']}
//         style={styles.gradientBorder}
//       >
//         <View style={[styles.videoWrapper, { aspectRatio }]}>
//           <Video
//             source={VIDEOS.SecondVideo}
//             ref={videoRef}
//             style={styles.backgroundVideo}
//             resizeMode="contain"
//             paused={false} // Auto-play video
//             repeat={true} // Loop video
//             volume={1.0}
//             audioFocus={false} // Don't take audio focus
//             ignoreSilentSwitch="ignore"
//             mixWithOthers={true} // Allow mixing with other audio
//             onError={(e) => console.log('Video error:', e)}
//             setFullScreen
//             onLoad={() => {
//               // Ensure video starts playing immediately when loaded
//               videoRef.current?.seek(0);
//             }}
//           />
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

function LearnGeeta() {
  const videoRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        // Stop audio when app goes to background
        if (audio) {
          audio.pause();
        }
        // Pause video
        if (videoRef.current) {
          videoRef.current.setNativeProps({ paused: true });
        }
      } else if (nextAppState === 'active') {
        // Resume audio when app comes to foreground
        if (audio && isAudioReady) {
          audio.play();
        }
        // Resume video
        if (videoRef.current) {
          videoRef.current.setNativeProps({ paused: false });
        }
      }
    };

    // Add AppState listener
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Lock orientation to landscape
    Orientation.lockToLandscape();

    // Configure audio settings for mixing
    Sound.setCategory('Playback', true);

    // Load and play audio
    loadAudio();

    return () => {
      Orientation.unlockAllOrientations();
      if (audio) {
        audio.stop();
        audio.release();
      }
      // Remove AppState listener
      appStateSubscription.remove();
    };
  }, []);

  const loadAudio = async () => {
    const localPath = `${RNFS.DocumentDirectoryPath}/sound.mp3`;

    try {
      const fileExists = await RNFS.exists(localPath);
      if (!fileExists) {
        await RNFS.downloadFile({
          fromUrl:
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          toFile: localPath,
        }).promise;
      }

      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          console.error('Error loading audio:', error);
          return;
        }

        // Configure audio settings
        sound.setVolume(1.0);
        sound.setNumberOfLoops(-1); // Loop indefinitely
        setAudio(sound);
        setIsAudioReady(true);
      });
    } catch (err) {
      console.error('Error downloading or loading audio:', err);
    }
  };

  const playAudio = () => {
    if (audio) {
      audio.play((success) => {
        if (!success) {
          console.error('Audio playback failed.');
        }
      });
    }
  };

  // Start playing audio as soon as it's ready
  useEffect(() => {
    if (isAudioReady && AppState.currentState === 'active') {
      playAudio();
    }
  }, [isAudioReady]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={['#ff8c00', '#ff0080']}
        style={styles.gradientBorder}
      >
        <View style={[styles.videoWrapper, { aspectRatio }]}>
          <Video
            source={VIDEOS.SecondVideo}
            ref={videoRef}
            style={styles.backgroundVideo}
            resizeMode="contain"
            paused={false}
            repeat={true}
            volume={1.0}
            audioFocus={false}
            ignoreSilentSwitch="ignore"
            mixWithOthers={true}
            playInBackground={false} // Prevent video playing in background
            playWhenInactive={false} // Prevent video playing when inactive
            onError={(e) => console.log('Video error:', e)}
            onLoad={() => {
              videoRef.current?.seek(0);
            }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LearnGeeta);
