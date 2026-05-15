import React, { useRef, useState, useCallback, memo } from 'react';
import { View, StatusBar, TouchableOpacity, ImageBackground, NativeModules, StyleSheet, BackHandler } from 'react-native';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import styles from './styles';
import { IMAGES, COLORS, FONTS } from '../../constants';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { COLOR_ARRAY, Navigation } from '../../constants/constants';
import { hp } from '../../utils/responsive';
import { VideoPlayer } from '../LearnGeeta/components';

import makeSelectFullChapterLearn from './selectors';
import { getFullGeeta, cleanUp } from './actions';
import { makeSelectIdealDetails } from '../App/selectors';

function FullChapterLearn({
  fullChapterLearn,
  selectedIdeal,
  handleGetFullGeeta,
  handleCleanUp,
  route
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentShlokIndex, setCurrentShlokIndex] = useState(0);

  const togglePlaybackRate = () => {
    const rates = [1.0, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const handleRestart = () => {
    videoRef.current?.seek(0);
    setIsVideoPlaying(true);
  };

  const { data, loading } = fullChapterLearn;

  useFocusEffect(
    useCallback(() => {
      Orientation.lockToLandscapeLeft();
    }, [])
  );

  const handleBack = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: Navigation.Home },
          {
            name: Navigation.Shloks,
            params: {
              chapterId: route?.params?.chapterId,
              serialNumber: route?.params?.serialNumber
            }
          },
        ],
      })
    );
  }, [navigation, route, Navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [handleBack])
  );

  useFocusEffect(
    useCallback(() => {
      handleGetFullGeeta({ ideal_id: selectedIdeal?.id, chapter_id: route?.params?.chapterId });
      return () => {
        handleCleanUp();
      };
    }, [handleGetFullGeeta, handleCleanUp, selectedIdeal, route?.params?.chapterId])
  );

  const handleVideoEnd = useCallback(() => {
    if (!data || data.length === 0) return;

    const currentChapter = data[currentChapterIndex];
    const totalShlokesInChapter = currentChapter?.shlokes?.length || 0;

    if (currentShlokIndex < totalShlokesInChapter - 1) {
      // Move to next shlok in current chapter
      setCurrentShlokIndex(prev => prev + 1);
    } else if (currentChapterIndex < data.length - 1) {
      // Move to first shlok of next chapter
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentShlokIndex(0);
    } else {
      // Finished all chapters and shlokes
      setIsVideoPlaying(false);
      // Optional: Navigation.goBack() or show completion
    }
  }, [data, currentChapterIndex, currentShlokIndex]);

  // Get current shlok data if available, otherwise use placeholder
  const currentChapter = data?.[currentChapterIndex];
  const currentShlok = currentChapter?.shlokes?.[currentShlokIndex];

  const shlokeParts = currentShlok?.shloke_parts || [
    'धर्मक्षेत्रे कुरुक्षेत्रे',
    'समवेता युयुत्सवः |',
    'मामकाः पाण्डवाश्चैव',
    'किमकुर्वत सञ्ंजय'
  ];

  const videoSource = {
    uri: currentShlok?.media?.hls_male_path || 'https://d4ofvs63sipze.cloudfront.net/final/vedvyas/ADHYA 1.1/index.m3u8',
  };

  if (loading || !data) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
      </SafeAreaView>
    );
  }

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
          videoSource={videoSource}
          isVideoPaused={() => !isVideoPlaying}
          onLoad={() => setIsVideoPlaying(true)}
          onEnd={handleVideoEnd}
          isIntroVideoPlayed={true}
          rate={playbackRate}
        />

        {/* UI Overlays with dynamic safe area handling */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Floating Back Button */}
          <View style={[styles.headerButtonsContainer, { top: insets.top + 20, left: insets.left + 20 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <IMAGES.WhiteArrowIcon height={28} width={28} />
            </TouchableOpacity>
          </View>

          {/* Shlok Card Overlay - Moved lower towards bottom edge */}
          <View style={[styles.overlay, { bottom: insets.bottom + 5 }]}>
            <FastImage
              style={styles.svgImageContainer}
              source={IMAGES.ShlokBackground}
              resizeMode={FastImage.resizeMode.stretch}
            />

            <View style={styles.shlokTextContainer}>
              <CustomText style={{ textAlign: 'center', lineHeight: hp(35) }} numberOfLines={2}>
                {shlokeParts.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <CustomText
                      style={{
                        fontSize: hp(22),
                        fontFamily: FONTS.HINDI,
                        fontWeight: '700',
                        color: COLOR_ARRAY[idx] || COLORS.black,
                      }}
                      numberOfLines={1}
                    >
                      {item}
                      {idx === 3 && currentChapter && currentShlok && (
                        ` || ${currentChapter.serial}.${currentShlok.name} ||`
                      )}
                    </CustomText>
                    {idx === 1 ? '\n' : idx < 3 ? ' ' : ''}
                  </React.Fragment>
                ))}
              </CustomText>
            </View>
          </View>

          {/* Bottom Controls Banner - Shifted from right safe edge */}
          <View style={[styles.bottomControlsContainer, { right: insets.right + 20 }]}>
            {/* Play/Pause Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsVideoPlaying(!isVideoPlaying)}
              activeOpacity={0.7}
            >
              {isVideoPlaying ? (
                <IMAGES.PauseIcon width={24} height={24} fill={COLORS.white} />
              ) : (
                <IMAGES.PlayerIcon width={24} height={24} fill={COLORS.white} />
              )}
            </TouchableOpacity>

            {/* Restart Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleRestart}
              activeOpacity={0.7}
            >
              <IMAGES.ReplayButton width={24} height={24} fill={COLORS.white} />
            </TouchableOpacity>

            {/* Speed Control */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={togglePlaybackRate}
              activeOpacity={0.7}
            >
              <CustomText style={styles.speedButtonText}>{playbackRate}x</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

FullChapterLearn.propTypes = {
  fullChapterLearn: PropTypes.object.isRequired,
  selectedIdeal: PropTypes.object,
  handleGetFullGeeta: PropTypes.func.isRequired,
  handleCleanUp: PropTypes.func.isRequired,
  route: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  fullChapterLearn: makeSelectFullChapterLearn(),
  selectedIdeal: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetFullGeeta: (payload) => dispatch(getFullGeeta(payload)),
    handleCleanUp: () => dispatch(cleanUp()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FullChapterLearn);
