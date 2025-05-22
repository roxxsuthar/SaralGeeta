/* eslint-disable react/prop-types */
/** * *
Home
* */

import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  SectionList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
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
import { getChapters } from './actions';
import { Navigation } from '../../constants/constants';
import { DrawerActions } from '@react-navigation/native';

function Home({ language, navigation, handleGetChapters, home }) {
  const { Home: HomeMessage } = strings;
  const { currentLanguage } = language;
  const sections = [
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

  const renderItemBasedOnSection = (title, item) => {
    switch (title) {
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
                {/* <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.iconContainer}
                  onPress={() => navigateToShloks(item?.uuid)}
                >
                  <IMAGES.PlayerIcon height="100%" width="100%" />
                </TouchableOpacity> */}
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
      <View style={styles.mainContainer}>
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
              style={styles.headerBellContainer}
            >
              <View style={styles.icon}>
                <IMAGES.BellIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {home?.loading ? (
          <LoadingScreen />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.uuid}
            // stickySectionHeadersEnabled
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeaderContainer}>
                {/* <CustomText style={styles.sectionHeader}>
                  {section.title}
                </CustomText> */}
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
    </ImageBackground>
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
