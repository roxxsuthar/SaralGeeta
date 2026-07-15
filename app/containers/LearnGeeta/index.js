import React, { useRef, useEffect, useState, useCallback } from 'react';
import strings from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
import {
  View,
  StatusBar,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  Platform,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash';
import { compose } from 'redux';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
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
  const isFocused = useIsFocused();

  const { currentLanguage } = language;

  const { start, copilotEvents } = useCopilot();
  const hasStartedGuide = useRef(false);
  const startRef = useRef(start);
  const copilotEventsRef = useRef(copilotEvents);

  startRef.current = start;
  copilotEventsRef.current = copilotEvents;

  useEffect(() => {
    const checkTutorial = async () => {
      if (hasStartedGuide.current) return;
      try {
        await AsyncStorage.removeItem('HAS_SEEN_HOME_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_SHLOKS_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_LEARNGEETA_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_BHAGWAN_TUTORIAL');
        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_LEARNGEETA_TUTORIAL');
        if (!hasSeen) {
          hasStartedGuide.current = true;
          setTimeout(() => {
            startRef.current();
          }, 1500);
        }
      } catch (e) {}
    };
    checkTutorial();
  }, []);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_LEARNGEETA_TUTORIAL', 'true').catch(() => {});
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);

  // ─── Local state ──────────────────────────────────────────────────────────
  const [isButton, setIsButton] = useState(false);
  const [shlokIndex, setShlokIndex] = useState();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isCommentaryPlaying, setIsCommentaryPlaying] = useState(false);

  // Track which shlok we last played commentary for (so we don't replay)
  const lastCommentaryPlayedId = useRef(null);
  // Pending commentary URL: set when data is ready but video hasn't loaded yet
  const pendingCommentaryUrl = useRef(null);

  // iOS native event emitter for audioPlaybackFinished
  const audioEmitter = useRef(
    Platform.OS === 'ios'
      ? new NativeEventEmitter(NativeModules.AudioRecorderModule)
      : null
  );

  // ─── Animation ────────────────────────────────────────────────────────────
  const backButtonTranslateY = useSharedValue(-150);
  const hideTimerRef = useRef(null);

  const backButtonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: backButtonTranslateY.value }],
  }));

  const toggleBackButton = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    backButtonTranslateY.value = withSpring(0, { damping: 8, stiffness: 40 });
    hideTimerRef.current = setTimeout(() => {
      backButtonTranslateY.value = withTiming(-150, { duration: 400 });
    }, 4000);
  }, [backButtonTranslateY]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      cancelAnimation(backButtonTranslateY);
    };
  }, []);

  // ─── Video hook ───────────────────────────────────────────────────────────
  const {
    videoUrl,
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

  // ─── Recording hook ───────────────────────────────────────────────────────
  const {
    isRecordingButton,
    transcription,
    waitingForTranslation,
    startRecording,
    stopRecording,
    resetTranscription,
  } = useRecording(learnGeeta, handleSaveResult);

  // ─── Helper: start commentary audio ───────────────────────────────────────
  // Called only after the shlok video is confirmed ready (isVideoReady = true).
  const startCommentary = useCallback((commentaryUrl) => {
    setIsCommentaryPlaying(true);
    setVideoPlayingState(true); // Pause the shlok video while commentary plays

    if (Platform.OS === 'ios') {
      // iOS: play via native AVPlayer which takes exclusive AVAudioSession
      // ownership so react-native-video cannot duck or interfere.
      NativeModules.AudioRecorderModule.playAudio(commentaryUrl)
        .then(() => {
          // Resolved means audio is ReadyToPlay and has started.
        })
        .catch((err) => {
          // Playback failed — resume video immediately so user isn't stuck.
          console.warn('[Commentary] playAudio failed:', err);
          setIsCommentaryPlaying(false);
          setVideoPlayingState(false);
        });
    }
    // Android: the hidden <Video> component below handles playback.
  }, [setVideoPlayingState]);

  // ─── Orientation + screen-blur cleanup ────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') {
        OrientationModule.lockToLandscape();
      } else {
        Orientation.lockToLandscape();
      }

      return () => {
        setVideoPlayingState(true);
        setIsCommentaryPlaying(false);
        pendingCommentaryUrl.current = null;
        if (Platform.OS === 'ios') {
          NativeModules.AudioRecorderModule.stopAudio().catch(() => {});
        }
      };
    }, [setVideoPlayingState])
  );

  // ─── Fetch shlok list ─────────────────────────────────────────────────────
  useEffect(() => {
    StatusBar.setHidden(true);
    handleGetShloks({ chapterId: get(route, 'params.chapter.id') });
  }, [handleGetShloks, route, currentLanguage]);

  // ─── Shlok data changed ───────────────────────────────────────────────────
  // When learnGeeta data arrives for a new shlok, remember the pending commentary
  // URL but don't start it yet — wait for the video to be ready (isVideoReady).
  useEffect(() => {
    setShlokIndex(
      shloks?.data?.findIndex((item) => item.id === learnGeeta?.data?.id)
    );

    const shlokId = get(learnGeeta, 'data.id');
    const commentaryAudio = get(learnGeeta, 'data.commentary.audio');


    if (isIntroVideoPlayed && commentaryAudio && shlokId !== lastCommentaryPlayedId.current) {
      // Mark as pending; will be triggered once the video is ready (see effect below).
      pendingCommentaryUrl.current = commentaryAudio;
      lastCommentaryPlayedId.current = shlokId;

      // Ensure video is paused until we've played commentary
      setVideoPlayingState(true);
    } else if (!commentaryAudio || !isIntroVideoPlayed) {
      pendingCommentaryUrl.current = null;
      setIsCommentaryPlaying(false);
      if (shlokId !== lastCommentaryPlayedId.current) {
        setVideoPlayingState(false);
      }
    }
  }, [shloks, learnGeeta, isIntroVideoPlayed, setVideoPlayingState]);

  // ─── Video ready → trigger pending commentary ─────────────────────────────
  // Correct sequence: video buffers (isVideoReady=true) → commentary plays
  // → audioPlaybackFinished event → video resumes.
  //
  // IMPORTANT: startCommentary is intentionally NOT in the deps array.
  // It is called inside the effect via a ref to avoid re-running the effect
  // every time startCommentary's identity changes (it changes each render
  // after setVideoPlayingState is called). The ref always points to the
  // latest version of the function so there's no stale closure risk.
  const startCommentaryRef = useRef(startCommentary);
  useEffect(() => {
    startCommentaryRef.current = startCommentary;
  });

  useEffect(() => {
    if (isVideoReady && !isLoading && pendingCommentaryUrl.current && isIntroVideoPlayed) {
      const url = pendingCommentaryUrl.current;
      pendingCommentaryUrl.current = null; // Clear before calling to prevent re-entry
      startCommentaryRef.current(url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoReady, isLoading, isIntroVideoPlayed]);


  // ─── iOS: listen for native audioPlaybackFinished event ───────────────────
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const sub = audioEmitter.current.addListener('audioPlaybackFinished', () => {
      setIsCommentaryPlaying(false);
      setVideoPlayingState(false); // Resume shlok video
    });
    return () => {
      sub.remove();
    };
  }, [setVideoPlayingState]);

  // ─── Seek to start when video is ready ────────────────────────────────────
  useEffect(() => {
    if (!isIntroVideoPlayed) {
      videoRef.current?.seek(0);
    } else if (isVideoReady && !isLoading && !isButton && !isCommentaryPlaying) {
      videoRef.current?.seek(0);
    }
  }, [isVideoReady, isLoading, isButton, isIntroVideoPlayed, isCommentaryPlaying]);

  useEffect(() => {
    handleGetShloksDetail({ shlok: get(route, 'params') });
  }, [handleGetShloksDetail, route]);

  // ─── Event handlers ────────────────────────────────────────────────────────
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
    setIsCommentaryPlaying(false);
    pendingCommentaryUrl.current = null;
    setVideoPlayingState(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex - 1]?.id } });
  }, [shloks, shlokIndex, resetTranscription, setVideoPlayingState, handleGetShloksDetail]);

  const getNextShlok = useCallback(() => {
    setIsButton(false);
    resetTranscription();
    setIsCommentaryPlaying(false);
    pendingCommentaryUrl.current = null;
    setVideoPlayingState(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex + 1]?.id } });
  }, [shloks, shlokIndex, resetTranscription, setVideoPlayingState, handleGetShloksDetail]);

  const playAgain = useCallback(() => {
    setIsButton(false);
    resetTranscription();

    // Reset commentary tracking to allow replay of the same shlok
    lastCommentaryPlayedId.current = null;
    setIsCommentaryPlaying(false);

    const commentaryAudio = get(learnGeeta, 'data.commentary.audio');
    const videoPath = get(learnGeeta, 'data.media.hls_male_path');

    // Seek the main video back to the beginning
    videoRef.current?.seek(0);

    if (commentaryAudio) {
      if (isVideoReady && !isLoading) {
        // Video is already loaded and ready, play commentary immediately
        startCommentary(commentaryAudio);
      } else {
        // Video is not ready yet, set as pending to play when ready
        pendingCommentaryUrl.current = commentaryAudio;
        setVideoPlayingState(true);
      }
    } else {
      pendingCommentaryUrl.current = null;
      setVideoPlayingState(false);
    }

    if (videoPath && videoPath !== videoUrl) {
      updateVideoUrl(videoPath);
      resetVideoState();
    }
  }, [
    learnGeeta,
    videoUrl,
    isVideoReady,
    isLoading,
    startCommentary,
    resetTranscription,
    setVideoPlayingState,
    updateVideoUrl,
    resetVideoState,
  ]);

  const onContinuePress = useCallback(() => {
    setVideoPlayingState(true);
    navigation.navigate(Navigation.FullChapterLearn, {
      chapterId: get(route, 'params.chapter.id'),
      serialNumber: get(route, 'params.chapter.serial'),
    });
  }, [navigation, route, setVideoPlayingState]);

  // ─── Render loading state ──────────────────────────────────────────────────
  if (get(learnGeeta, 'loading')) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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

  const poster = get(learnGeeta, 'data.image') || get(learnGeeta, 'data.cover_image');
  const hasVideoUrl = isIntroVideoPlayed
    ? get(learnGeeta, 'data.media.hls_male_path')
    : selectedIdeal?.hls_male_path;

  const shouldShowIntroLoading = !isIntroVideoPlayed && (isLoading || !isVideoReady);
  const shouldShowLoading = isIntroVideoPlayed && (isLoading || !hasVideoUrl);

  const translationContent = learnGeeta?.data?.translation?.translation || '';

  const handleOpenDrawer = () => {
    if (Platform.OS === 'ios') {
      OrientationModule.lockToLandscape();
    } else {
      Orientation.lockToLandscape();
    }
    setTimeout(() => setIsDrawerVisible(true), 100);
  };

  const commentaryAudioUrl = get(learnGeeta, 'data.commentary.audio');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      <ImageBackground
        source={IMAGES.MainScreenBackground}
        style={styles.gradientBorder}
        resizeMode="cover"
      >
        {/*
          Main shlok video — ALWAYS uses the shlok video source (never switches to commentary).
          It loads while paused, so it's buffered and ready to play the moment commentary ends.
          Paused whenever: commentary is playing, video not ready, or user hasn't acted.
        */}
        <VideoPlayer
          videoRef={videoRef}
          videoSource={getVideoSource()}
          // On iOS: mute the video while commentary is playing to prevent
          // react-native-video from re-competing for the AVAudioSession.
          // On Android: rely on the existing mute flags.
          muted={isCommentaryPlaying || isButton || isRecordingButton}
          disableAudioTrack={false}
          isVideoPaused={() => isCommentaryPlaying || isVideoPaused() || !isFocused}
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

        {/*
          Commentary Audio Player (Android only).
          iOS commentary is handled natively by AudioRecorderModule.playAudio().
          On Android, this hidden <Video> plays the commentary audio while the main
          video is paused. When it ends, the main video is unpaused.
        */}
        {Platform.OS !== 'ios' && isCommentaryPlaying && commentaryAudioUrl && (
          <Video
            source={{ uri: commentaryAudioUrl }}
            paused={!isFocused}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch="ignore"
            mixWithOthers="mix"
            progressUpdateInterval={50}
            onProgress={(data) => {
              // Pre-trigger 1.2 s before end for seamless transition
              if (
                data.currentTime > 0.5 &&
                data.seekableDuration > 0 &&
                data.currentTime > data.seekableDuration - 1.2
              ) {
                setIsCommentaryPlaying(false);
                setVideoPlayingState(false);
              }
            }}
            onEnd={() => {
              setIsCommentaryPlaying(false);
              setVideoPlayingState(false);
            }}
            onError={() => {
              setIsCommentaryPlaying(false);
              setVideoPlayingState(false);
            }}
            style={{ position: 'absolute', width: 1, height: 1, top: 0, left: 0, opacity: 0 }}
          />
        )}

        {/* Safe Area Wrapper for UI Elements */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <View
            style={{ flex: 1 }}
            pointerEvents="box-none"
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => {}}
          >
            {/* Static Back Button */}
            <View
              style={[
                styles.iosBackButton,
                { top: insets.top + 10, left: insets.left + 16 },
              ]}
            >
              <CopilotStep
                text={strings.Copilot.learnGeetaBackBtn.defaultMessage}
                order={1}
                name="backBtn"
              >
                <CopilotTouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                  style={styles.iosBackButtonInner}
                >
                  <IMAGES.WhiteArrowIcon height={24} width={24} />
                  <CustomText style={styles.iosBackButtonText}>
                    श्रीमद्‍भगवद्‍गीता
                  </CustomText>
                </CopilotTouchableOpacity>
              </CopilotStep>
            </View>

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
              <View
                style={{ flex: 1, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }}
                pointerEvents="box-none"
              >
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
                    onContinuePress={onContinuePress}
                    onShowPress={handleOpenDrawer}
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
const MemoizedLearnGeeta = React.memo(LearnGeeta);

function LearnGeetaWrapper(props) {

  const labels = {
    previous: strings.Copilot.previous.defaultMessage,
    next: strings.Copilot.next.defaultMessage,
    skip: strings.Copilot.skip.defaultMessage,
    finish: strings.Copilot.finish.defaultMessage,
  };
  global.copilotSupportedOrientations = ['landscape', 'landscape-left', 'landscape-right'];
  return (
    <CopilotProvider
      verticalOffset={Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0}
      backdropColor="rgba(0, 0, 0, 0.7)"
      labels={labels}
    >
      <MemoizedLearnGeeta {...props} />
    </CopilotProvider>
  );
}

LearnGeetaWrapper.propTypes = {
  language: PropTypes.object,
};

export default compose(withConnect)(LearnGeetaWrapper);
