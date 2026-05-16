import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StatusBar, TouchableOpacity, NativeModules, Animated, TouchableWithoutFeedback, Platform, StyleSheet, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash';
import { compose } from 'redux';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { useFocusEffect, DrawerActions } from '@react-navigation/native';
import Video from 'react-native-video';

// Custom hooks
import { useVideo, useRecording } from './hooks';

// Components
import {
  VideoPlayer,
  RecordingInterface,
  TranslationDrawer,
} from './components';
import CustomText from '../../components/CustomText';
import strings from '../../../i18n';

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
import { Navigation } from '../../constants/constants';
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
  selectedIdeal,
  handleSaveResult,
  handleGetShloks,
  ourIdeals,
  language,
  navigation,
}) {
  const insets = useSafeAreaInsets();
  const videoRef = useRef(null);

  const { currentLanguage } = language;
  // Local state
  const [isButton, setIsButton] = useState(false);
  const [shlokIndex, setShlokIndex] = useState();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isCommentaryPlaying, setIsCommentaryPlaying] = useState(false);

  // Animation for iOS back button
  const backButtonAnim = useRef(new Animated.Value(-150)).current;
  const hideTimerRef = useRef(null);
  const lastCommentaryPlayedId = useRef(null);

  const toggleBackButton = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    Animated.spring(backButtonAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    hideTimerRef.current = setTimeout(() => {
      Animated.timing(backButtonAnim, {
        toValue: -150,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 4000);
  }, [backButtonAnim]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const {
    isVideoPlaying,
    isVideoReady,
    isLoading,
    updateVideoUrl,
    setVideoReady,
    setVideoLoading,
    setVideoPlayingState,
    resetVideoState,
    getVideoSource,
    isVideoPaused,
  } = useVideo(learnGeeta, selectedIdeal, isIntroVideoPlayed);

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
      if (Platform.OS === 'ios') {
        OrientationModule.lockToLandscape();
      } else {
        Orientation.lockToLandscape();
      }
    }, []),
  );

  // Effects
  useEffect(() => {
    StatusBar.setHidden(true);
    handleGetShloks({ chapterId: get(route, 'params.chapter.id') });
  }, [handleGetShloks, route, currentLanguage]);

  useEffect(() => {
    setShlokIndex(
      shloks?.data?.findIndex((item) => item.id === learnGeeta?.data?.id),
    );

    // Play commentary audio if available when shlok changes
    const shlokId = get(learnGeeta, 'data.id');
    const commentaryAudio = get(learnGeeta, 'data.commentary.audio');
    
    if (isIntroVideoPlayed && commentaryAudio && shlokId !== lastCommentaryPlayedId.current) {
      setIsCommentaryPlaying(true);
      setVideoPlayingState(true); // In this hook, true means paused
      lastCommentaryPlayedId.current = shlokId;
    } else if (!commentaryAudio || !isIntroVideoPlayed) {
      setIsCommentaryPlaying(false);
      // If we're not playing commentary, ensure video is not force-paused
      if (shlokId !== lastCommentaryPlayedId.current) {
        setVideoPlayingState(false);
      }
    }
  }, [shloks, learnGeeta, isIntroVideoPlayed, setVideoPlayingState]);

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
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />

        <View style={styles.cloudAnimationContainer}>
          <FastImage
            style={styles.chakraImage}
            source={IMAGES.Chakra}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    );
  }

  const poster =
    get(learnGeeta, 'data.image') || get(learnGeeta, 'data.cover_image');

  const hasVideoUrl = isIntroVideoPlayed
    ? get(learnGeeta, 'data.media.hls_male_path')
    : selectedIdeal?.hls_male_path;

  // Show loading animation for intro video
  const shouldShowIntroLoading =
    !isIntroVideoPlayed && (isLoading || !isVideoReady);

  // Show loading animation after intro video
  const shouldShowLoading = isIntroVideoPlayed && (isLoading || !hasVideoUrl);

  const translationContent = learnGeeta?.data?.translation?.translation || '';
  const handleOpenDrawer = () => {
    // Lock orientation FIRST
    if (Platform.OS === 'ios') {
      OrientationModule.lockToLandscape();
    } else {
      Orientation.lockToLandscape();
    }

    // Small delay to ensure orientation is locked before modal opens
    setTimeout(() => {
      setIsDrawerVisible(true);
    }, 100);
  };
  return (
    <View style={styles.container}>
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
        {/* Background Video - Full Screen */}
        <VideoPlayer
          videoRef={videoRef}
          videoSource={getVideoSource()}
          // Disable audio track when recording to prevent session conflicts
          // Mute video when recording to prevent echo/feedback, but keep it playing
          muted={isButton || isRecordingButton}
          disableAudioTrack={false}
          isVideoPaused={() => isCommentaryPlaying || isVideoPaused()}
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

        {/* Commentary Audio Player */}
        {isCommentaryPlaying && get(learnGeeta, 'data.commentary.audio') && (
          <Video
            source={{ uri: get(learnGeeta, 'data.commentary.audio') }}
            paused={false}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch="ignore"
            mixWithOthers="mix"
            progressUpdateInterval={50}
            onProgress={(data) => {
              // Pre-trigger video unpause 1.2 seconds before audio ends
              if (data.currentTime > 0.5 && data.seekableDuration > 0 && data.currentTime > data.seekableDuration - 1.2) {
                setIsCommentaryPlaying(false);
                setVideoPlayingState(false);
              }
            }}
            onEnd={() => {
              if (isCommentaryPlaying) {
                setIsCommentaryPlaying(false);
                setVideoPlayingState(false);
              }
            }}
            onError={() => {
              setIsCommentaryPlaying(false);
              setVideoPlayingState(false);
            }}
            style={{ width: 0, height: 0, position: 'absolute' }}
          />
        )}

        {/* Safe Area Wrapper for UI Elements */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View
            style={{ flex: 1 }}
            pointerEvents="box-none"
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => toggleBackButton()}
          >
            {/* Back Bar (Patti) */}
            <Animated.View
              style={[
                styles.backButtonBar,
                {
                  top: insets.top,
                  transform: [{ translateY: backButtonAnim }]
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <IMAGES.WhiteArrowIcon height={28} width={28} />
                <CustomText style={styles.backButtonTitle}>
                  श्रीमद्‍भगवद्‍गीता
                </CustomText>
              </TouchableOpacity>
            </Animated.View>

            {/* Header Buttons - Top Right */}
            {isIntroVideoPlayed && (
              <View style={[styles.headerButtonsContainer, { top: insets.top + 20, right: insets.right + 35 }]}>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() =>
                    navigation.navigate(Navigation.FullChapterLearn, {
                      chapterId: get(route, 'params.chapter.id'),
                      serialNumber: get(route, 'params.chapter.serial'),
                    })
                  }
                  activeOpacity={0.8}
                >
                  <CustomText style={styles.continueButtonText}>
                    {strings.learnGeeta.continue.defaultMessage || 'Continue'}
                  </CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={handleOpenDrawer}
                  activeOpacity={0.8}
                >
                  {['भगवान वेद व्यास', 'Bhagwan Ved Vyas'].includes(
                    selectedIdeal?.name,
                  ) ? (
                    <IMAGES.InfoWhiteIcon height={28} width={28} />
                  ) : (
                    <IMAGES.InfoIcon height={28} width={28} />
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Translation Drawer */}
            <TranslationDrawer
              visible={isDrawerVisible}
              onClose={() => setIsDrawerVisible(false)}
              translationContent={translationContent}
              currentLanguage={currentLanguage}
              commentary={learnGeeta?.data?.commentary}
              shloke={learnGeeta?.data?.shloke_parts}
              shlokNo={learnGeeta?.data?.shloke_no}
              chapterDetail={learnGeeta?.data?.chapter}
            />

            {/* Skip button for intro video */}
            {!isIntroVideoPlayed && !shouldShowIntroLoading && (
              <TouchableOpacity
                style={[styles.skipButton, { top: insets.top + 20, right: insets.right + 20 }]}
                onPress={handleIntroPlay}
                activeOpacity={0.8}
              >
                <CustomText style={styles.skipButtonText}>Skip</CustomText>
              </TouchableOpacity>
            )}

            {shouldShowIntroLoading && (
              <View style={styles.cloudAnimationContainer}>
                <FastImage
                  style={styles.chakraImage}
                  source={IMAGES.Chakra}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            )}

            {/* Show loading when switching videos (e.g., hls_male_path to hls_male_user) */}
            {isButton && isLoading && (
              <View style={styles.cloudAnimationContainer}>
                <FastImage
                  style={styles.chakraImage}
                  source={IMAGES.Chakra}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            )}

            {isIntroVideoPlayed && (
              <View style={{ flex: 1, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }} pointerEvents="box-none">
                {shouldShowLoading ? (
                  <View style={styles.cloudAnimationContainer}>
                    <FastImage
                      style={styles.chakraImage}
                      source={IMAGES.Chakra}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                ) : (
                  <RecordingInterface
                    transcription={transcription}
                    learnGeeta={learnGeeta}
                    isButton={isButton}
                    isRecordingButton={isRecordingButton}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    videoRef={videoRef}
                    isVideoPlaying={isVideoPlaying}
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
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
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
  selectedIdeal: PropTypes.object.isRequired,
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
  selectedIdeal: makeSelectIdealDetails(),
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
