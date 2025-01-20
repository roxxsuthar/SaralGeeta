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
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';

import makeSelectShloks from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { setFontFamily } from '../../utils/device';
import { makeSelectAppLanguage } from '../App/selectors';
import { FONTS, IMAGES } from '../../constants';
import { getShloks } from './actions';
import { Navigation } from '../../constants/constants';

function Shloks({ language, handleGetShloks, route, shloksData, navigation }) {
  const { currentLanguage } = language;

  useEffect(() => {
    handleGetShloks({ chapterId: get(route, 'params.chapterId') });
  }, [route]);

  const navigateToLearnGeeta = useCallback((item) => {
    navigation.navigate(Navigation.LearnGeeta, item);
  }, []);

  const renderItem = useCallback(
    (item) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.cardContainer}
          onPress={() => navigateToLearnGeeta(item)}
        >
          <FastImage
            style={styles.cardImage}
            source={IMAGES.Krishna}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.textContainer}>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.HINDI, FONTS.HINDI),
                styles.cardTitle,
              )}
            >
              {get(item, 'shlokas_text')}
            </CustomText>
            {/* <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.languageText,
              )}
            >
              {item?.language}
            </CustomText>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.timeText,
              )}
            >
              Time: {item?.time}
            </CustomText> */}
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
      resizeMode="cover" // Similar to background-size in CSS
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <FastImage
        style={styles.chakraStyle}
        source={IMAGES.Chakra}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.mainContainer}>
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
            <FastImage
              style={styles.chapterImage}
              source={IMAGES.Trainer}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerText,
            }}
          >
            {get(shloksData, 'data[0].chapter_details.name', 'Shloks')}
          </CustomText>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={backHandler}
              style={styles.headerSearchContainer}
            >
              <View style={styles.icon}>
                <IMAGES.SearchIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={backHandler}
              style={styles.headerSearchContainer}
            >
              <View style={styles.icon}>
                <IMAGES.WhitePlayIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {shloksData?.loading ? (
          <LoadingScreen />
        ) : (
          <>
            <CustomText
              style={{
                ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                ...styles.headerComponentDescription,
              }}
              numberOfLines={8}
            >
              {get(shloksData, 'data[0].chapter_details.description')}
            </CustomText>
            <View style={styles.flatListContainer}>
              <View style={styles.handle} />
              <FlatList
                data={shloksData?.data}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contentContainerStyle}
                ItemSeparatorComponent={itemSeparatorComponent}
              />
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

Shloks.propTypes = { ...Shloks };

const mapStateToProps = createStructuredSelector({
  shloksData: makeSelectShloks(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { handleGetShloks: (payload) => dispatch(getShloks(payload)) };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Shloks);
