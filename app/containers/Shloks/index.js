/** * *
Shloks
* */

import React, { useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Platform,
  NativeModules,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import makeSelectShloks from './selectors';
import strings from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
import styles from './styles';
import FastImageLoading from '../../components/FastImageLoading';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { setFontFamily } from '../../utils/device';
import { makeSelectAppLanguage } from '../App/selectors';
import { FONTS, IMAGES } from '../../constants';
import { getShloks } from './actions';
import { resetIntroVideo } from '../App/actions';
import { COLOR_ARRAY, Navigation } from '../../constants/constants';
import { hp } from '../../utils/responsive';

function Shloks({
  language,
  handleGetShloks,
  route,
  shloksData,
  navigation,
  handleResetIntroVideo,
}) {
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
      if (shloksData?.data && shloksData.data.length > 0) {
        try {

        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_SHLOKS_TUTORIAL');
          if (!hasSeen) {
            hasStartedGuide.current = true;
            AsyncStorage.setItem('HAS_SEEN_SHLOKS_TUTORIAL', 'true').catch(() => {});
            setTimeout(() => {
              startRef.current();
            }, 1500);
          }
        } catch (e) {}
      }
    };
    checkTutorial();
  }, [shloksData]);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_SHLOKS_TUTORIAL', 'true').catch(() => {});
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') {
        OrientationModule.lockToPortrait();
      } else {
        Orientation.lockToPortrait();
      }
    }, []),
  );

  useEffect(() => {
    StatusBar.setHidden(false);
    handleGetShloks({ chapterId: get(route, 'params.chapterId') });
  }, [route, currentLanguage]);

  const navigateToLearnGeeta = useCallback(
    (item) => {
      navigation.navigate(Navigation.LearnGeeta, item);
    },
    [navigation],
  );

  const navigateToIntroVideo = useCallback(() => {
    // Reset intro video state so it plays again
    handleResetIntroVideo();

    // Get the first shlok from the chapter
    const firstShlok = get(shloksData, 'data[0]');
    if (firstShlok) {
      // Navigate to LearnGeeta - intro video will play because state is reset
      navigation.navigate(Navigation.LearnGeeta, firstShlok);
    }
  }, [shloksData, navigation, handleResetIntroVideo]);

  const renderListItem = useCallback(
    ({ item, index }) => {
      return (
      <CopilotStep
        text={strings.Copilot.shloksFirstShlok.defaultMessage}
        order={3}
        name="firstShlok"
        active={index === 0}
      >
        <CopilotTouchableOpacity
          activeOpacity={0.8}
          style={styles.cardContainer}
          onPress={() => navigateToLearnGeeta(item)}
        >
          <FastImageLoading
            styles={styles.cardImage}
            imageUrl={item?.image}
            resizeMode="contain"
            indicatorColor="#ffa600ff"
          />
          <View style={styles.textContainer}>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.HINDI, FONTS.HINDI),
                styles.cardTitle,
              )}
              numberOfLines={0}
            >
              {get(item, 'shloke_parts', []).map((part, idx) => (
                <React.Fragment key={idx}>
                  <CustomText
                    style={{
                      fontSize: hp(20),
                      fontFamily: FONTS.HINDI,
                      fontWeight: '400',
                      color: COLOR_ARRAY[idx],
                    }}
                  >
                    {part}
                    {idx === 3 && (
                      <CustomText style={styles.cardTitle1}>
                        ||{get(item, 'chapter.serial', '')},
                        {get(item, 'name', '')}||
                      </CustomText>
                    )}
                  </CustomText>
                  {idx < 3 && (idx === 1 ? '\n' : ' ')}
                </React.Fragment>
              ))}
              {'  '}
            </CustomText>
          </View>
        </CopilotTouchableOpacity>
      </CopilotStep>
      );
    },
    [currentLanguage],
  );

  const itemSeparatorComponent = useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );

  const backHandler = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <FastImageLoading
        styles={styles.chakraStyle}
        imageUrl={IMAGES.Chakra}
        resizeMode="contain"
        isLocal={true}
        indicatorColor="#ffa600ff"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.imageContainer}>
            <CopilotStep
              text={strings.Copilot.shloksBackBtn.defaultMessage}
              order={1}
              name="backBtn"
            >
              <CopilotTouchableOpacity
                activeOpacity={0.8}
                onPress={backHandler}
                style={styles.headerSubContainer}
              >
                <View style={styles.icon}>
                  <IMAGES.WhiteArrowIcon height="100%" width="100%" />
                </View>
              </CopilotTouchableOpacity>
            </CopilotStep>
            <FastImageLoading
              styles={styles.chapterImage}
              imageUrl={get(shloksData, 'data[0].image', '')}
              resizeMode="contain"
              indicatorColor="#ffa600ff"
            />
          </View>
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerText,
            }}
          >
            {get(shloksData, 'data[0].chapter.name', 'Shloks')}
          </CustomText>
          <View style={styles.headerIcons}>
            <CopilotStep
              text={strings.Copilot.shloksPlayIntroBtn.defaultMessage}
              order={2}
              name="playIntroBtn"
            >
              <CopilotTouchableOpacity
                activeOpacity={0.8}
                onPress={navigateToIntroVideo}
                style={styles.headerSearchContainer}
              >
                <View style={styles.icon}>
                  <IMAGES.WhitePlayIcon height="100%" width="100%" />
                </View>
              </CopilotTouchableOpacity>
            </CopilotStep>
          </View>
        </View>
        <View style={styles.mainContainer}>
          {shloksData?.loading ? (
            <LoadingScreen />
          ) : (
            <>
              <View style={styles.flatListContainer}>
                <View style={styles.handle} />
                <FlashList
                  data={shloksData?.data}
                  renderItem={renderListItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.contentContainerStyle}
                  ItemSeparatorComponent={itemSeparatorComponent}
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={150}
                />
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

Shloks.propTypes = {
  language: PropTypes.object,
  handleGetShloks: PropTypes.func,
  route: PropTypes.object,
  shloksData: PropTypes.object,
  navigation: PropTypes.object,
  handleResetIntroVideo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  shloksData: makeSelectShloks(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetShloks: (payload) => dispatch(getShloks(payload)),
    handleResetIntroVideo: () => dispatch(resetIntroVideo()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const MemoizedShloks = React.memo(Shloks);

function ShloksWrapper(props) {

  const labels = {
    previous: strings.Copilot.previous.defaultMessage,
    next: strings.Copilot.next.defaultMessage,
    skip: strings.Copilot.skip.defaultMessage,
    finish: strings.Copilot.finish.defaultMessage,
  };
  global.copilotSupportedOrientations = ['portrait'];
  return (
    <CopilotProvider
      verticalOffset={0}
      backdropColor="rgba(0, 0, 0, 0.7)"
      labels={labels}
    >
      <MemoizedShloks {...props} />
    </CopilotProvider>
  );
}

ShloksWrapper.propTypes = {
  language: PropTypes.object,
};

export default compose(withConnect)(ShloksWrapper);
