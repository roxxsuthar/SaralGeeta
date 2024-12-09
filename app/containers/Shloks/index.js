/** * *
Shloks
* */

import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { View, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';

import makeSelectShloks from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import { makeSelectAppLanguage } from '../App/selectors';
import strings from '../../../i18n';
import { FONTS, IMAGES } from '../../constants';

function Shloks({ language }) {
  const { Shloks: ShloksMessage } = strings;
  const { currentLanguage } = language;

  const data = [
    {
      id: 1,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 2,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 3,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 4,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 5,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 6,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 7,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
    {
      id: 8,
      title: 'Adhyay 1',
      image: IMAGES.Krishna,
      time: moment().format('HH:mm:ss'),
      language: 'Hindi / Sanskrit',
    },
  ];

  const renderItem = useCallback(
    (item) => {
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer}>
          <FastImage
            style={styles.cardImage}
            source={item?.image}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={styles.textContainer}>
            <CustomText
              style={Object.assign(
                setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                styles.cardTitle,
              )}
            >
              {item?.title}
            </CustomText>
            <CustomText
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

  return (
    <LinearGradient
      colors={['rgb(227,126,93)', 'rgb(242,206,88)']}
      style={styles.container}
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
        <View style={styles.header}>
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerText,
            }}
          >
            {ShloksMessage.headerText.defaultMessage}
          </CustomText>
        </View>
        <View style={styles.headerComponent}>
          <FastImage
            style={styles.chapterImage}
            source={IMAGES.Trainer}
            resizeMode={FastImage.resizeMode.contain}
          />
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerComponentText,
            }}
          >
            Chapter 1
          </CustomText>
        </View>
        <CustomText
          style={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.headerComponentDescription,
          }}
        >
          Be it to welcome the rising sun or to face the challenges of life,
          kids benefit a lot from the regular recitation of shlokas and
          mantras....
        </CustomText>
        <View style={styles.flatListContainer}>
          <View style={styles.handle} />
          <FlatList
            data={data}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentContainerStyle}
            ItemSeparatorComponent={itemSeparatorComponent}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

Shloks.propTypes = { ...Shloks };

const mapStateToProps = createStructuredSelector({
  shloks: makeSelectShloks(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Shloks);
