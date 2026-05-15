/** * *
Shloks
* */

import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform,
  NativeModules,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';

import makeSelectShloks from './selectors';
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

  const renderItem = useCallback(
    (item) => {
      return (
        <TouchableOpacity
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
        </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={backHandler}
              style={styles.headerSubContainer}
            >
              <View style={styles.icon}>
                <IMAGES.WhiteArrowIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={navigateToIntroVideo}
              style={styles.headerSearchContainer}
            >
              <View style={styles.icon}>
                <IMAGES.WhitePlayIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.mainContainer}>
          {shloksData?.loading ? (
            <LoadingScreen />
          ) : (
            <>
              <View style={styles.flatListContainer}>
                <View style={styles.handle} />
                <FlatList
                  data={shloksData?.data}
                  renderItem={({ item }) => renderItem(item)}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.contentContainerStyle}
                  ItemSeparatorComponent={itemSeparatorComponent}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

Shloks.propTypes = { ...Shloks };

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

export default compose(withConnect)(Shloks);
