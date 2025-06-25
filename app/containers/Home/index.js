/* eslint-disable react/prop-types */
/** * *
Home
* */

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  SectionList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import makeSelectHome from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { setFontFamily } from '../../utils/device';
import { FONTS, IMAGES } from '../../constants';
import strings from '../../../i18n';
import { makeSelectAppLanguage } from '../App/selectors';
import { getChapters, getRecentWatched } from './actions';
import { Navigation } from '../../constants/constants';
import { DrawerActions } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native';

function Home({
  language,
  navigation,
  handleGetChapters,
  home,
  handleGetRecent,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredChapters, setFilteredChapters] = useState([]);
  const { Home: HomeMessage } = strings;
  const { currentLanguage } = language;
  const recent = get(home, 'recent');

  const sections = [
    {
      title: HomeMessage.recent.defaultMessage,
      data: recent ? [recent] : [], // Ensure Recent is a single-item array
    },
    {
      title: HomeMessage.chapters.defaultMessage,
      data: filteredChapters?.filter((item) => item.id !== recent?.id) || [], // Exclude Recent from Chapters
    },
  ];

  useEffect(() => {
    handleGetRecent();
    handleGetChapters();
    return () => {
      setShowSearch(false);
      setSearchText('');
    };
  }, []);

  useEffect(() => {
    if (home?.data) {
      setFilteredChapters(home.data);
    }
  }, [home?.data]);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredChapters(home?.data || []);
    } else {
      const filtered = home?.data?.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredChapters(filtered);
    }
  }, [searchText, home?.data]);

  const navigateToShloks = useCallback((id) => {
    setShowSearch(false);
    setSearchText('');
    navigation.navigate(Navigation.Shloks, { chapterId: id });
  }, []);

  const navigateToLearnShlock = (item) => {
    navigation.navigate(Navigation.LearnGeeta, item);
  };

  const renderItemBasedOnSection = (title, item) => {
    switch (title) {
      case 'Recent':
        return (
          <TouchableOpacity
            style={styles.recentViewContainer}
            onPress={() => navigateToLearnShlock(item)}
            activeOpacity={0.8}
          >
            <FastImage
              style={styles.cardImage}
              source={{ uri: get(item, 'image') }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.cardSeparator} />
            <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
              <IMAGES.PlayerIcon height="100%" width="100%" />
            </TouchableOpacity>
            <View style={styles.recentTextContainer}>
              <CustomText
                style={{
                  ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
                  ...styles.audioCardText,
                }}
              >
                {get(item, 'shloke')}
              </CustomText>
            </View>
          </TouchableOpacity>
        );
      case 'Chapters':
        return (
          <TouchableOpacity
            style={styles.AudioContainer}
            onPress={() => navigateToShloks(item?.id)}
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
              <View style={styles.imageContainer}></View>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const ItemSeparator = () => <View style={styles.separator} />;

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
      <FastImage
        style={styles.chakraStyle}
        source={IMAGES.Chakra}
        resizeMode={FastImage.resizeMode.contain}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            activeOpacity={0.8}
            // onPress={backHandler}
            style={styles.headerSubContainer}
          >
            <View style={styles.icon}>
              <IMAGES.ThreeBars height="100%" width="100%" />
            </View>
          </TouchableOpacity>

          <CustomText
            style={{
              ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              ...styles.headerText,
            }}
          >
            {HomeMessage.headerText.defaultMessage}
          </CustomText>
          <View style={styles.rightIconContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSearch((prev) => !prev)}
              style={styles.headerSearchContainer}
            >
              <View style={styles.icon}>
                <IMAGES.SearchIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.headerBellContainer}
            >
              <View style={styles.icon}>
                <IMAGES.BellIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Chapters..."
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}
        {home?.loading ? (
          <LoadingScreen />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <>
                {!isEmpty(section?.data) && (
                  <View style={styles.sectionHeaderContainer}>
                    <CustomText style={styles.sectionHeader}>
                      {section.title}
                    </CustomText>
                  </View>
                )}
              </>
            )}
            renderItem={({ item, section }) =>
              renderItemBasedOnSection(section.title, item, section)
            }
            SectionSeparatorComponent={ItemSeparator}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

Home.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
  handleGetChapters: PropTypes.func,
  home: PropTypes.object,
  handleGetRecent: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetChapters: () => dispatch(getChapters()),
    handleGetRecent: () => dispatch(getRecentWatched()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
