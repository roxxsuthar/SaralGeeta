import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash';
import { compose } from 'redux';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

// Custom hooks
import {
  useAudio,
  useVideo,
  useRecording,
  useAppState,
  // useOrientation,
  useBackHandler,
} from './hooks';

// Components
import { VideoPlayer, ControlButtons, RecordingInterface } from './components';

// Redux
import makeSelectLearnGeeta from './selectors';
import { getShloksDetail, saveResult } from './actions';
import {
  makeSelectIdealDetails,
  makeSelectIntroVideo,
  makeSelectUser,
} from '../App/selectors';
import { introVideoWatched } from '../App/actions';
import makeSelectShloks from '../Shloks/selectors';
import { getShloks } from '../Shloks/actions';

// Constants and styles
import { IMAGES } from '../../constants';
import styles from './styles';
import makeSelectOurIdeals from '../OurIdeals/selectors';
import FastImage from 'react-native-fast-image';
import logger from '../../utils/logger';

function LearnGeeta({
  handleGetShloksDetail,
  route,
  isIntroVideoPlayed,
  handleIntroVideo,
  learnGeeta,
  user,
  shloks,
  introVideo,
  handleSaveResult,
  handleGetShloks,
  ourIdeals,
}) {
  const videoRef = useRef(null);
  // Local state
  const [isButton, setIsButton] = useState(false);
  const [shlokIndex, setShlokIndex] = useState();

  // Custom hooks
  const { audio, isAudioReady, playAudio, pauseAudio, loadAudio } =
    useAudio(learnGeeta);

  const {
    isVideoReady,
    isVideoPlaying,
    isLoading,
    updateVideoUrl,
    setVideoReady,
    setVideoLoading,
    setVideoPlayingState,
    resetVideoState,
    getVideoSource,
    isVideoPaused,
  } = useVideo(learnGeeta, introVideo, isIntroVideoPlayed);

  const {
    isRecordingButton,
    transcription,
    waitingForTranslation,
    startRecording,
    stopRecording,
    resetTranscription,
  } = useRecording(learnGeeta, handleSaveResult);

  // Setup orientation and back handler
  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscape();

      return () => {
        Orientation.unlockAllOrientations();
      };
    }, []),
  );

  useBackHandler(audio);

  // Setup app state management
  useAppState(
    audio,
    isAudioReady,
    isIntroVideoPlayed,
    isVideoReady,
    isLoading,
    isButton,
    playAudio,
  );

  // Effects
  useEffect(() => {
    handleGetShloks({ chapterId: get(route, 'params.chapter.id') });
  }, [handleGetShloks, route]);

  useEffect(() => {
    setShlokIndex(
      shloks?.data?.findIndex((item) => item.id === learnGeeta?.data?.id),
    );
  }, [shloks, learnGeeta]);

  useEffect(() => {
    if (!isIntroVideoPlayed) {
      videoRef.current?.seek(0);
    } else if (isAudioReady && isVideoReady && !isLoading && !isButton) {
      playAudio();
      videoRef.current?.seek(0);
    }
  }, [
    isAudioReady,
    isVideoReady,
    isLoading,
    isButton,
    playAudio,
    isIntroVideoPlayed,
  ]);

  useEffect(() => {
    handleGetShloksDetail({ shlok: get(route, 'params') });
  }, [handleGetShloksDetail, route]);

  // Event handlers
  const handleIntroPlay = useCallback(() => {
    handleIntroVideo();
  }, [handleIntroVideo]);

  const handleVideoError = useCallback(
    (error) => {
      console.log('Video error:', error);
      setVideoReady(false);
      setVideoLoading(false);
      pauseAudio();
    },
    [setVideoReady, setVideoLoading, pauseAudio],
  );

  const handleVideoLoadStart = useCallback(() => {
    setVideoLoading(true);
  }, [setVideoLoading]);

  const handleVideoLoad = useCallback(
    (data) => {
      setVideoLoading(false);
      console.log('Video loaded:', data);
      setVideoReady(true);
    },
    [setVideoLoading, setVideoReady],
  );

  const handlePlaybackStateChanged = useCallback(
    (e) => {
      if (e?.isPlaying === false && !isVideoPlaying && isIntroVideoPlayed) {
        pauseAudio();
      } else if (audio && !isVideoPlaying && isIntroVideoPlayed) {
        playAudio();
      }
    },
    [isVideoPlaying, isIntroVideoPlayed, audio, pauseAudio, playAudio],
  );

  const handlePlaybackResume = useCallback(() => {
    if (audio && !audio.isPlaying()) {
      playAudio();
    }
  }, [audio, playAudio]);

  const getPreviousShlok = useCallback(() => {
    setIsButton(false);
    resetTranscription();
    setVideoPlayingState(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex - 1]?.id } });
  }, [
    shloks,
    shlokIndex,
    resetTranscription,
    setVideoPlayingState,
    handleGetShloksDetail,
  ]);

  const getNextShlok = useCallback(() => {
    setIsButton(false);
    resetTranscription();
    setVideoPlayingState(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex + 1]?.id } });
  }, [
    shloks,
    shlokIndex,
    resetTranscription,
    setVideoPlayingState,
    handleGetShloksDetail,
  ]);

  const playAgain = useCallback(() => {
    setIsButton(false);
    resetTranscription();
    setVideoPlayingState(false);

    const videoPath = get(learnGeeta, 'data.media.hls_male_path');
    if (videoPath) {
      updateVideoUrl(videoPath);
      resetVideoState();
    } else {
      logger.log('Video URL not available for replay');
    }

    loadAudio();
  }, [
    learnGeeta,
    resetTranscription,
    setVideoPlayingState,
    updateVideoUrl,
    resetVideoState,
    loadAudio,
  ]);

  // Render loading state
  if (get(learnGeeta, 'loading')) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
          hidden={true}
        />

        <FastImage
          style={styles.cloudAnimationContainer}
          source={
            ourIdeals?.data[0]?.name === 'Krishan'
              ? IMAGES.PeacockFeather
              : IMAGES.Leaf
          }
          resizeMode={FastImage.resizeMode.cover}
        />
      </SafeAreaView>
    );
  }

  const poster =
    get(learnGeeta, 'data.image') || get(learnGeeta, 'data.cover_image');

  // Check if media URLs are available
  const hasAudioUrl = !!get(learnGeeta, 'data.media.audio');
  const hasVideoUrl = isIntroVideoPlayed
    ? get(learnGeeta, 'data.media.hls_male_path')
    : introVideo?.hls_male_path;

  // Show loading animation for intro video
  const shouldShowIntroLoading =
    !isIntroVideoPlayed && (isLoading || !isVideoReady);

  // Show loading animation after intro video
  const shouldShowLoading =
    isIntroVideoPlayed && (isLoading || !hasVideoUrl || !hasAudioUrl);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
        hidden={true}
      />

      <ImageBackground
        source={IMAGES.MainScreenBackground}
        style={styles.gradientBorder}
        resizeMode="cover"
      >
        <VideoPlayer
          videoRef={videoRef}
          videoSource={getVideoSource()}
          isVideoPaused={isVideoPaused}
          onError={handleVideoError}
          onLoadStart={handleVideoLoadStart}
          onLoad={handleVideoLoad}
          onPlaybackStateChanged={handlePlaybackStateChanged}
          onPlaybackResume={handlePlaybackResume}
          poster={poster}
          isIntroVideoPlayed={isIntroVideoPlayed}
          handleIntroPlay={handleIntroPlay}
          setIsButton={setIsButton}
          setIsVideoPlaying={setVideoPlayingState}
          updateVideoUrl={updateVideoUrl}
          learnGeeta={learnGeeta}
          user={user}
        />
        {/* <LoadingAnimation animationRef={animationRef} /> */}
        {waitingForTranslation && (
          <FastImage
            style={styles.cloudAnimationContainer}
            source={
              ourIdeals?.data[0]?.name === 'Krishan'
                ? IMAGES.PeacockFeather
                : IMAGES.Leaf
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        )}

        {shouldShowIntroLoading && (
          <FastImage
            style={styles.cloudAnimationContainer}
            source={
              ourIdeals?.data[0]?.name === 'Krishan'
                ? IMAGES.PeacockFeather
                : IMAGES.Leaf
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        )}

        {isButton && !isRecordingButton && (
          <ControlButtons
            shlokIndex={shlokIndex}
            shloks={shloks}
            getPreviousShlok={getPreviousShlok}
            playAgain={playAgain}
            getNextShlok={getNextShlok}
          />
        )}

        {isIntroVideoPlayed && (
          <>
            {shouldShowLoading ? (
              <FastImage
                style={styles.cloudAnimationContainer}
                source={
                  ourIdeals?.data[0]?.name === 'Krishan'
                    ? IMAGES.PeacockFeather
                    : IMAGES.Leaf
                }
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <RecordingInterface
                transcription={transcription}
                learnGeeta={learnGeeta}
                isButton={isButton}
                isRecordingButton={isRecordingButton}
                startRecording={startRecording}
                stopRecording={stopRecording}
                audio={audio}
                videoRef={videoRef}
                setIsVideoPlaying={setVideoPlayingState}
                ourIdeals={ourIdeals}
                waitingForTranslation={waitingForTranslation}
              />
            )}
          </>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

LearnGeeta.propTypes = {
  handleGetShloksDetail: PropTypes.func.isRequired,
  handleIntroVideo: PropTypes.func.isRequired,
  route: PropTypes.object.isRequired,
  isIntroVideoPlayed: PropTypes.bool.isRequired,
  learnGeeta: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  shloks: PropTypes.object.isRequired,
  introVideo: PropTypes.object.isRequired,
  handleSaveResult: PropTypes.func.isRequired,
  handleGetShloks: PropTypes.func.isRequired,
  ourIdeals: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
  isIntroVideoPlayed: makeSelectIntroVideo(),
  user: makeSelectUser(),
  shloks: makeSelectShloks(),
  introVideo: makeSelectIdealDetails(),
  ourIdeals: makeSelectOurIdeals(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetShloksDetail: (payload) => dispatch(getShloksDetail(payload)),
    handleIntroVideo: () => dispatch(introVideoWatched()),
    handleSaveResult: (payload) => dispatch(saveResult(payload)),
    handleGetShloks: (payload) => dispatch(getShloks(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LearnGeeta);
