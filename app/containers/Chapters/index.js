/** * *
Chapters
* */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  SectionList,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import split from 'lodash/split';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import makeSelectChapters from './selectors';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import { FONTS, IMAGES } from '../../constants';
import strings from '../../../i18n';
import { makeSelectAppLanguage } from '../App/selectors';

function Chapters({ language, navigation }) {
  const { Chapters: ChaptersMessage } = strings;
  const { currentLanguage } = language;

  const sections = [
    {
      title: 'Audio',
      data: [
        {
          id: 1,
          image: IMAGES.Frame,
          icon: 'https://picsum.photos/700',
          title: 'Shrimad Bhagavd Gita',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
        {
          id: 2,
          image: IMAGES.Frame,
          icon: 'https://picsum.photos/700',
          title: 'Shrimad Bhagavd Gita',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
        {
          id: 3,
          image: IMAGES.Frame,
          icon: 'https://picsum.photos/700',
          title: 'Shrimad Bhagavd Gita',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
      ],
    },
    {
      title: 'E-Book',
      data: [
        {
          id: 1,
          image: IMAGES.Rath,
          title: 'Sankhya Yog',
          description:
            'Certified personal trainer with 5 years of experience. Specializes in weight lifting and high-intensity training.',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
        {
          id: 2,
          image: IMAGES.Rath,
          title: 'Sankhya Yog',
          description:
            'Certified personal trainer with 5 years of experience. Specializes in weight lifting and high-intensity training.',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
        {
          id: 3,
          image: IMAGES.Rath,
          title: 'Sankhya Yog',
          description:
            'Certified personal trainer with 5 years of experience. Specializes in weight lifting and high-intensity training.',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
        {
          id: 4,
          image: IMAGES.Rath,
          title: 'Sankhya Yog',
          description:
            'Certified personal trainer with 5 years of experience. Specializes in weight lifting and high-intensity training.',
          videoTime: '10:20',
          timeUsed: '05:10',
        },
      ],
    },
  ];

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
    switch (title) {
      case 'E-Book':
        return (
          <View style={styles.AudioContainer}>
            <FastImage
              style={styles.audioCardImage}
              // source={{ uri: item.image }}
              source={item.image}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.audioTextContainer}>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.audioCardTitle,
                }}
              >
                {item.title}
              </CustomText>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.audioCardDescription,
                }}
              >
                {item.description}
              </CustomText>
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.iconContainer}
                >
                  <IMAGES.PlayerIcon height="100%" width="100%" />
                </TouchableOpacity>
                <TouchableOpacity
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
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const ItemSeparator = () => <View style={styles.separator} />;
  const flatListItemSeparator = () => <View style={styles.flatSeparator} />;

  const navigateToAudio = useCallback(() => {
    alert();
  }, []);
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
            {ChaptersMessage.headerText.defaultMessage}
          </CustomText>
        </View>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderContainer}>
              <CustomText style={styles.sectionHeader}>
                {section.title}
              </CustomText>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigateToAudio()}
              >
                <CustomText style={styles.sectionViewAll}>View all</CustomText>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item, section, index }) => {
            // Render "Audio" using FlatList horizontally
            if (section.title === 'Audio' && index === 0) {
              return (
                <FlatList
                  data={section.data}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  ItemSeparatorComponent={flatListItemSeparator}
                  renderItem={({ item }) => (
                    <View style={styles.recentViewContainer}>
                      <FastImage
                        style={styles.cardImage}
                        // source={{ uri: item.image }}
                        source={item.image}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <View style={styles.cardSeparator} />
                      <View style={styles.recentTextContainer}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.iconContainer}
                        >
                          <IMAGES.PlayerIcon height="100%" width="100%" />
                        </TouchableOpacity>
                        <CustomText
                          style={{
                            ...setFontFamily(
                              currentLanguage,
                              FONTS.REGULAR,
                              FONTS.HINDI,
                            ),
                            ...styles.audioCardText,
                          }}
                        >
                          {item.title}
                        </CustomText>
                      </View>
                    </View>
                  )}
                  showsHorizontalScrollIndicator={false}
                />
              );
            }

            // For other sections like "E-Book", continue using SectionList
            return renderItemBasedOnSection(section.title, item);
          }}
          SectionSeparatorComponent={ItemSeparator}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

Chapters.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  chapters: makeSelectChapters(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Chapters);
