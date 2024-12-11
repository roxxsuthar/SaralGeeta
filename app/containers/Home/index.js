/* eslint-disable react/prop-types */
/** * *
Home
* */

import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, SectionList, TouchableOpacity } from 'react-native';
import split from 'lodash/split';
// import isEqual from 'lodash/isEqual';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import makeSelectHome from './selectors';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { setFontFamily } from '../../utils/device';
import { FONTS, IMAGES } from '../../constants';
import strings from '../../../i18n';
import { makeSelectAppLanguage } from '../App/selectors';
import { getChapters } from './actions';
import { Navigation } from '../../constants/constants';

function Home({ language, navigation, handleGetChapters, home }) {
  const { Home: HomeMessage } = strings;
  const { currentLanguage } = language;

  const sections = [
    {
      title: 'Recent View',
      data: [
        {
          id: 1,
          image: 'https://picsum.photos/700',
          icon: 'https://picsum.photos/700',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
      ],
    },
    {
      title: 'Chapters',
      data: home?.data || [],
    },
  ];

  useEffect(() => {
    handleGetChapters();
  }, []);

  const navigateToShloks = useCallback((id) => {
    navigation.navigate(Navigation.Shloks, { chapterId: id });
  }, []);

  const timeStringToSeconds = (timeString) => {
    const timeParts = split(timeString, ':').map(Number);

    if (timeParts.length === 2) {
      // MM:SS format
      return timeParts[0] * 60 + timeParts[1];
    } else if (timeParts.length === 3) {
      // HH:MM:SS format
      return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else {
      console.warn('Invalid time format:', timeString);
    }

    return 0;
  };

  const VideoProgressBar = (currentTime, duration) => {
    // Calculate progress as a percentage
    const totalDuration = timeStringToSeconds(duration);
    const current = timeStringToSeconds(currentTime);
    const progress = (current / totalDuration) * 100;

    return (
      <View style={styles.container}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>
    );
  };

  const renderItemBasedOnSection = (title, item) => {
    // if (!item) return null;
    switch (title) {
      case 'Recent View':
        return (
          <View style={styles.recentViewContainer}>
            <FastImage
              style={styles.cardImage}
              source={{ uri: item.image }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.recentTextContainer}>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.recentCardText,
                }}
              >
                {item.text}
              </CustomText>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.recentCardTimeText,
                }}
              >
                {item.videoTime} - {item.timeUsed}
              </CustomText>
              {VideoProgressBar(item.timeUsed, item.videoTime)}
            </View>
          </View>
        );
      case 'Chapters':
        return (
          <TouchableOpacity
            style={styles.AudioContainer}
            onPress={() => navigateToShloks(item?.uuid)}
            activeOpacity={0.8}
          >
            <FastImage
              style={styles.audioCardImage}
              source={{ uri: item.image }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.audioTextContainer}>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.audioCardTitle,
                }}
              >
                {item.name}
              </CustomText>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.audioCardDescription,
                }}
                numberOfLines={3}
              >
                {item.description}
              </CustomText>
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.iconContainer}
                  onPress={() => navigateToShloks(item?.uuid)}
                >
                  <IMAGES.PlayerIcon height="100%" width="100%" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.iconContainer}
                >
                  <IMAGES.Heart height="100%" width="100%" />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.iconContainer}
                >
                  <CustomText style={styles.oneXText}>1</CustomText>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const ItemSeparator = () => <View style={styles.separator} />;

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
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerText,
            }}
          >
            {HomeMessage.headerText.defaultMessage}
          </CustomText>
        </View>
        {home?.loading ? (
          <LoadingScreen />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.uuid}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeaderContainer}>
                <CustomText style={styles.sectionHeader}>
                  {section.title}
                </CustomText>
                {/* {!isEqual(section?.title, 'Recent View') && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigateToAudio()}
                  >
                    <CustomText style={styles.sectionViewAll}>
                      View all
                    </CustomText>
                  </TouchableOpacity>
                )} */}
              </View>
            )}
            renderItem={({ item, section }) =>
              renderItemBasedOnSection(section.title, item)
            }
            SectionSeparatorComponent={ItemSeparator}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
    </LinearGradient>
  );
}

Home.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
  handleGetChapters: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { handleGetChapters: () => dispatch(getChapters()) };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
