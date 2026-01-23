import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StatusBar, TouchableOpacity,NativeModules } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageBackground } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash';
import { compose } from 'redux';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { useFocusEffect } from '@react-navigation/native';

// Custom hooks
import { useVideo, useRecording } from './hooks';

// Components
import {
  VideoPlayer,
  RecordingInterface,
  TranslationDrawer,
} from './components';
import CustomText from '../../components/CustomText';

// Redux
import makeSelectLearnGeeta from './selectors';
import { getShloksDetail, saveResult } from './actions';
import {
  makeSelectAppLanguage,
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
  language,
}) {
  const videoRef = useRef(null);

  const { currentLanguage } = language;
  // Local state
  const [isButton, setIsButton] = useState(false);
  const [shlokIndex, setShlokIndex] = useState();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const {
    isVideoReady,
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
     OrientationModule.lockToLandscape(); 
     
      return () => {
        setTimeout(() => {
          OrientationModule.lockToPortrait();
        }, 500);
      };
    }, []),
  );

  // Effects
  useEffect(() => {
    StatusBar.setHidden(true);
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
    } else if (isVideoReady && !isLoading && !isButton) {
      videoRef.current?.seek(0);
    }
  }, [isVideoReady, isLoading, isButton, isIntroVideoPlayed]);

  useEffect(() => {
    handleGetShloksDetail({ shlok: get(route, 'params') });
  }, [handleGetShloksDetail, route]);

  // Event handlers
  const handleIntroPlay = useCallback(() => {
    handleIntroVideo();
  }, [handleIntroVideo]);

  const handleVideoError = useCallback(() => {
    setVideoReady(false);
    setVideoLoading(false);
  }, [setVideoReady, setVideoLoading]);

  const handleVideoLoadStart = useCallback(() => {
    setVideoLoading(true);
  }, [setVideoLoading]);

  const handleVideoLoad = useCallback(() => {
    setVideoLoading(false);
    setVideoReady(true);
  }, [setVideoLoading, setVideoReady]);

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
    }
  }, [
    learnGeeta,
    resetTranscription,
    setVideoPlayingState,
    updateVideoUrl,
    resetVideoState,
  ]);

  // Render loading state
  if (get(learnGeeta, 'loading')) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
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

  const hasVideoUrl = isIntroVideoPlayed
    ? get(learnGeeta, 'data.media.hls_male_path')
    : introVideo?.hls_male_path;

  // Show loading animation for intro video
  const shouldShowIntroLoading =
    !isIntroVideoPlayed && (isLoading || !isVideoReady);

  // Show loading animation after intro video
  const shouldShowLoading = isIntroVideoPlayed && (isLoading || !hasVideoUrl);

  const translationContent = learnGeeta?.data?.translation?.translation || '';
const handleOpenDrawer = () => {
  // Lock orientation FIRST
  OrientationModule.lockToLandscape();
  
  // Small delay to ensure orientation is locked before modal opens
  setTimeout(() => {
    setIsDrawerVisible(true);
  }, 100);
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <ImageBackground
        source={IMAGES.MainScreenBackground}
        style={styles.gradientBorder}
        resizeMode="cover"
      >
        {/* Eye Icon - Top Right */}
       {isIntroVideoPlayed && (
  <TouchableOpacity
    style={styles.eyeIconButton}
    onPress={handleOpenDrawer} // Changed this
    activeOpacity={0.8}
  >
    <IMAGES.InfoIcon height={28} width={28} />
  </TouchableOpacity>
)}

        {/* Translation Drawer */}
        <TranslationDrawer
          visible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          translationContent={translationContent}
          currentLanguage={currentLanguage}
          commentary={learnGeeta?.data?.commentary}
          shloke={learnGeeta?.data?.shloke_parts}
          chapterDetail={learnGeeta?.data?.chapter}
        />

        <VideoPlayer
          videoRef={videoRef}
          videoSource={getVideoSource()}
          // Disable audio track when recording to prevent session conflicts
          muted={isButton}
          disableAudioTrack={isRecordingButton}
          isVideoPaused={isVideoPaused}
          onError={handleVideoError}
          onLoadStart={handleVideoLoadStart}
          onLoad={handleVideoLoad}
          poster={poster}
          isIntroVideoPlayed={isIntroVideoPlayed}
          handleIntroPlay={handleIntroPlay}
          setIsButton={setIsButton}
          setIsVideoPlaying={setVideoPlayingState}
          updateVideoUrl={updateVideoUrl}
          learnGeeta={learnGeeta}
          user={user}
        />

        {/* Skip button for intro video */}
        {!isIntroVideoPlayed && !shouldShowIntroLoading && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleIntroPlay}
            activeOpacity={0.8}
          >
            <CustomText style={styles.skipButtonText}>Skip</CustomText>
          </TouchableOpacity>
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

        {/* Show loading when switching videos (e.g., hls_male_path to hls_male_user) */}
        {isButton && isLoading && (
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
                videoRef={videoRef}
                setIsVideoPlaying={setVideoPlayingState}
                ourIdeals={ourIdeals}
                waitingForTranslation={waitingForTranslation}
                shlokIndex={shlokIndex}
                shloks={shloks}
                getPreviousShlok={getPreviousShlok}
                playAgain={playAgain}
                getNextShlok={getNextShlok}
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
  language: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
  isIntroVideoPlayed: makeSelectIntroVideo(),
  user: makeSelectUser(),
  shloks: makeSelectShloks(),
  introVideo: makeSelectIdealDetails(),
  ourIdeals: makeSelectOurIdeals(),
  language: makeSelectAppLanguage(),
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
