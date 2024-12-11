import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StatusBar, Dimensions, AppState } from 'react-native';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { compose } from 'redux';
import makeSelectLearnGeeta from './selectors';
import { IMAGES, VIDEOS } from '../../constants';
import styles from './styles';
import { getShloksDetail } from './actions';
import { makeSelectIntroVideo } from '../App/selectors';
import { introVideoWatched } from '../App/actions';
import CustomText from '../../components/CustomText';

Sound.setCategory('Playback'); // Allow audio to play in the background

function LearnGeeta({
  handleGetShloksDetail,
  route,
  introVideo,
  handleIntroVideo,
  learnGeeta,
}) {
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
          audio.stop();
        }
      } else if (nextAppState === 'active') {
        // Resume audio when app comes to foreground
        if (audio && isAudioReady && introVideo) {
          audio.play();
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
  }, [AppState.currentState]);

  const loadAudio = async () => {
    const fileName = get(learnGeeta, 'data.shlokas_voice').split('/').pop();
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
      const fileExists = await RNFS.exists(localPath);
      if (!fileExists) {
        await RNFS.downloadFile({
          fromUrl: get(learnGeeta, 'data.shlokas_voice'),
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

  // Start playing audio as soon as it's ready and introVideo is true
  useEffect(() => {
    if (isAudioReady && introVideo && AppState.currentState === 'active') {
      playAudio();
    }
  }, [isAudioReady, introVideo, AppState.currentState]);

  useEffect(() => {
    handleGetShloksDetail({ shlok_id: get(route, 'params.uuid') });
  }, [route]);

  const handleIntroPlay = useCallback(() => {
    handleIntroVideo();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={['#000000', '#000000']}
        style={styles.gradientBorder}
      >
        <View style={[styles.videoWrapper, { aspectRatio }]}>
          <Video
            source={
              isEqual(introVideo, false)
                ? VIDEOS.IntroVideo
                : VIDEOS.SecondVideo
            }
            ref={videoRef}
            style={styles.backgroundVideo}
            resizeMode="contain"
            paused={!isAudioReady} // Pause video if audio is not ready
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
            onEnd={() => {
              isEqual(introVideo, false) && handleIntroPlay();
            }}
          />
        </View>
        {introVideo && (
          <>
            <View style={styles.shlokBackground}>
              <IMAGES.ShlokBackground height="100%" width="100%" />
            </View>
            <CustomText style={styles.shlokText}>
              {get(learnGeeta, 'data.shlokas_text')}
            </CustomText>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

LearnGeeta.propTypes = {
  navigation: PropTypes.object,
  handleGetShloksDetail: PropTypes.func,
  handleIntroVideo: PropTypes.func,
  route: PropTypes.object,
  introVideo: PropTypes.bool,
  learnGeeta: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
  introVideo: makeSelectIntroVideo(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetShloksDetail: (payload) => dispatch(getShloksDetail(payload)),
    handleIntroVideo: () => dispatch(introVideoWatched()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LearnGeeta);
