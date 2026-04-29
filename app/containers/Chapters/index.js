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
  ImageBackground,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
// import split from 'lodash/split';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import makeSelectChapters from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import { FONTS, IMAGES } from '../../constants';
import strings from '../../../i18n';
import { makeSelectAppLanguage } from '../App/selectors';
import { getRecentWatched } from './actions';
import { useEffect } from 'react';

function Chapters({ language, handleGetRecent }) {
  const { Chapters: ChaptersMessage } = strings;
  const { currentLanguage } = language;

  const sections = [
    {
      title: 'Recent View',
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
  ];

  useEffect(() => {
    handleGetRecent();
  }, []);

  const ItemSeparator = () => <View style={styles.separator} />;
  const flatListItemSeparator = () => <View style={styles.flatSeparator} />;

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
      <View style={styles.mainContainer}>
        <View style={[styles.header, { flexDirection: 'row', alignItems: 'center' }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, zIndex: 10 }}
          >
            <IMAGES.Bars height="100%" width="100%" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <CustomText
              style={{
                ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                ...styles.headerText,
              }}
            >
              {ChaptersMessage.headerText.defaultMessage}
            </CustomText>
          </View>
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
                // onPress={() => navigateToAudio()}
              >
                <CustomText style={styles.sectionViewAll}>View all</CustomText>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item, section, index }) => {
            // Render "Audio" using FlatList horizontally
            if (section.title === 'Recent View' && index === 0) {
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
                        source={
                          typeof item.image === 'string'
                            ? { uri: item.image }
                            : item.image
                        }
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
            // return renderItemBasedOnSection(section.title, item);
          }}
          SectionSeparatorComponent={ItemSeparator}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

Chapters.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
  handleGetRecent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  chapters: makeSelectChapters(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { handleGetRecent: () => dispatch(getRecentWatched()) };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Chapters);
