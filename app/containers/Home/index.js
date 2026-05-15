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
  Platform,
  PermissionsAndroid,
  useWindowDimensions,
  Linking,
  Share,
  Animated,
  NativeModules,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import Voice from '@react-native-voice/voice';
import { useFocusEffect } from '@react-navigation/native';

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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from '../../utils/responsive';

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
  const [isListening, setIsListening] = useState(false);
  const [isSocialExpanded, setIsSocialExpanded] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const { Home: HomeMessage, HomeBottomBar } = strings;
  const { currentLanguage } = language;
  const recent = get(home, 'recent');

  const { width: windowWidth } = useWindowDimensions();
  const numColumns = windowWidth > 600 ? 2 : 1;

  const chaptersData = filteredChapters?.filter((item) => item.id !== recent?.id) || [];

  // Chunking helper for grid display
  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );

  const processedChapters =
    numColumns > 1 ? chunkArray(chaptersData, numColumns) : chaptersData;

  const sections = [
    {
      title: HomeMessage.recent.defaultMessage,
      data: !recent ? [] : [recent],
    },
    {
      title: HomeMessage.chapters.defaultMessage,
      data: processedChapters,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      // Reset bottom bar and search states to initial
      setIsSocialExpanded(false);
      setIsMenuExpanded(false);
      setShowSearch(false);
      setSearchText('');

      // Ensure StatusBar is visible when Home screen is focused
      StatusBar.setHidden(false);

      // Ensure orientation is locked to portrait
      if (Platform.OS === 'ios') {
        OrientationModule.lockToPortrait();
      } else {
        Orientation.lockToPortrait();
      }

      handleGetRecent();
      handleGetChapters(currentLanguage);
    }, [handleGetRecent, handleGetChapters, currentLanguage]),
  );

  useEffect(() => {
    handleGetRecent();
    handleGetChapters(currentLanguage);

    let mounted = true;

    // Set up voice recognition callbacks
    const voiceSetup = async () => {
      if (!mounted) return;

      try {
        // Clean up first
        await Voice.destroy().catch(() => { });
        await Voice.removeAllListeners();

        // Wait a moment before setting up
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!mounted) return;

        // Set up event listeners
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechPartialResults = onSpeechResults;
        Voice.onSpeechVolumeChanged = () => { };
      } catch {
        /* empty */
      }
    };

    voiceSetup();

    return () => {
      mounted = false;
      const cleanup = async () => {
        try {
          setShowSearch(false);
          setSearchText('');
          setIsListening(false);
          await Voice.stop().catch(() => { });
          await Voice.destroy().catch(() => { });
          await Voice.removeAllListeners();
        } catch {
          /* empty */
        }
      };
      cleanup();
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

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    // Just update the state, don't try to stop again
    setIsListening(false);
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0].trim();
      setSearchText(recognizedText);

      // Filter chapters based on the recognized text
      if (home?.data) {
        const filtered = home.data.filter((item) =>
          item.name?.toLowerCase().includes(recognizedText.toLowerCase()),
        );
        setFilteredChapters(filtered);
      }
    }

    setIsListening(false);
    // Automatically stop voice recognition after getting results
    Voice.stop().catch();
  };

  const onSpeechError = async (e) => {
    setIsListening(false);

    // Don't show alerts for common cases
    if (
      e.error?.code === '7' || // no match
      e.error?.code === '0' || // cancelled
      e.error?.message?.includes('cancelled')
    ) {
      return;
    }

    try {
      // Cleanup
      await Voice.stop().catch(() => { });
      await Voice.destroy().catch(() => { });
    } catch {
      /* empty */
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'This app needs access to your microphone for voice search',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        // For iOS, we need to check microphone permission
        try {
          await Voice.isAvailable();
          return true;
        } catch {
          return false;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const startVoiceSearch = async () => {
    if (isListening) {
      await stopVoiceSearch();
      return;
    }

    try {
      setSearchText(''); // Clear existing search text
      setIsListening(true);

      // Clean up previous instance
      await Voice.destroy().catch(() => { });
      await Voice.removeAllListeners();

      // Check permissions first
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        setIsListening(false);
        return;
      }

      // Set up event listeners
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechEnd = onSpeechEnd;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;
      Voice.onSpeechPartialResults = onSpeechResults;

      const languageCode = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';

      // Start recognition
      await Voice.start(languageCode);
    } catch {
      setIsListening(false);
    }
  };

  const stopVoiceSearch = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
      await Voice.destroy();
    } catch {
      /* empty */
    }
  };

  const navigateToShloks = useCallback(
    (id, serial) => {
      setShowSearch(false);
      setSearchText('');
      navigation.navigate(Navigation.Shloks, {
        chapterId: id,
        serialNumber: serial,
      });
    },
    [navigation],
  );

  const navigateToLearnShlock = (item) => {
    navigation.navigate(Navigation.LearnGeeta, item);
  };

  const renderItemBasedOnSection = (title, item) => {
    switch (title) {
      case HomeMessage.recent.defaultMessage:
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
              <View style={{ flexDirection: 'column' }}>
                <CustomText
                  style={{
                    ...setFontFamily(
                      currentLanguage,
                      FONTS.REGULAR,
                      FONTS.HINDI,
                    ),
                    ...styles.audioCardText,
                    textAlign: 'center',
                  }}
                >
                  {get(item, 'shloke_parts', []).map((part, idx) => (
                    <React.Fragment key={idx}>
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
                        {part}
                      </CustomText>
                      {idx < 3 && (idx === 1 ? '\n' : ' ')}
                    </React.Fragment>
                  ))}
                </CustomText>
              </View>
            </View>
          </TouchableOpacity>
        );
      case HomeMessage.chapters.defaultMessage:
        if (numColumns > 1) {
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
              {item.map((chapter) => (
                <View key={chapter.id} style={{ width: '47%' }}>
                  {renderChapterCard(chapter)}
                </View>
              ))}
            </View>
          );
        }
        return renderChapterCard(item);
      default:
        return null;
    }
  };

  const renderChapterCard = (item) => (
    <TouchableOpacity
      style={styles.AudioContainer}
      onPress={() => navigateToShloks(item?.id, item?.serial)}
      activeOpacity={0.8}
    >
      <FastImage
        style={styles.audioCardImage}
        source={{ uri: item.image }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.audioTextContainer}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <CustomText
            style={{
              ...setFontFamily(
                currentLanguage,
                FONTS.REGULAR,
                FONTS.HINDI,
              ),
              ...styles.audioCardTitle,
            }}
          >
            {item.name}
            {'  ('}
            {HomeMessage.chapter.defaultMessage} {item?.serial}
            {')'}
          </CustomText>
        </View>
        <CustomText
          style={{
            ...setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            ...styles.audioCardDescription,
          }}
        >
          {item.description}
        </CustomText>
        <View style={styles.imageContainer}></View>
      </View>
    </TouchableOpacity>
  );

  const toggleSocialMenu = () => {
    setIsSocialExpanded(!isSocialExpanded);
    if (isMenuExpanded) setIsMenuExpanded(false);
  };

  const toggleAppMenu = () => {
    setIsMenuExpanded(!isMenuExpanded);
    if (isSocialExpanded) setIsSocialExpanded(false);
  };

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.log('Error opening link:', e);
    }
  };

  const shareApp = async () => {
    try {
      const smartLink = 'https://app.saralgita.in/share';

      await Share.share({
        message: `${HomeMessage.shareMessage.defaultMessage} \n${smartLink}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderSocialMenu = () => {
    if (!isSocialExpanded) return null;
    return (
      <View style={styles.expandedMenuContainer}>
        <View style={styles.expandedMenuOverlay}>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://www.facebook.com/people/Saral-Gita/61577334227489/')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.FacebookIcon width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{HomeBottomBar.facebook.defaultMessage}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://www.instagram.com/saralgitaapp')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.InstagramIcon width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{HomeBottomBar.instagram.defaultMessage}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://twitter.com/')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.TwitterX width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{HomeBottomBar.twitter.defaultMessage}</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGridMenu = () => {
    if (!isMenuExpanded) return null;
    return (
      <View style={styles.expandedMenuContainer}>
        <View style={styles.gridMenuOverlay}>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigation.navigate(Navigation.FAQ, { fromHome: true })}>
              <IMAGES.FaqNew width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.faq.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigation.navigate(Navigation.Language, { fromHome: true })}>
              <IMAGES.LanguageNew width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.language.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.gridMenuItem}
              onPress={() =>
                openLink(
                  Platform.OS === 'android'
                    ? 'https://play.google.com/store/apps/details?id=com.saralgita'
                    : 'https://apps.apple.com/kz/app/saral-gita/id6754391932'
                )
              }
            >
              <IMAGES.UpdateApp width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.update.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={shareApp}>
              <IMAGES.ShareApp width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.shareApp.defaultMessage}</CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.gridRow}>
            <TouchableOpacity
              style={styles.gridMenuItem}
              onPress={() =>
                openLink(
                  Platform.OS === 'android'
                    ? 'https://play.google.com/store/apps/details?id=com.saralgita'
                    : 'https://apps.apple.com/kz/app/saral-gita/id6754391932'
                )
              }
            >
              <IMAGES.StarOutline width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.rating.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigation.navigate(Navigation.ContactUs, { fromHome: true })}>
              <IMAGES.ContactPhone width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.contact.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigation.navigate(Navigation.Instructions, { fromHome: true })}>
              <IMAGES.HelpSquare width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.help.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={toggleSocialMenu}>
              <IMAGES.SocialBubbles width={24} height={24} />
              <CustomText style={styles.menuItemText}>{HomeBottomBar.social.defaultMessage}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
        hidden={false}
        backgroundColor="transparent"
      />

      <FastImage
        style={styles.chakraStyle}
        source={IMAGES.Chakra}
        resizeMode={FastImage.resizeMode.contain}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            activeOpacity={0.8}
            style={styles.headerSubContainer}
          >
            <View style={styles.icon}>
              <IMAGES.ThreeBars height="100%" width="100%" />
            </View>
          </TouchableOpacity>

          <CustomText
            numberOfLines={1}
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
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Chapters..."
              placeholderTextColor="#ffffff"
              value={searchText}
              onChangeText={setSearchText}
              allowFontScaling={false}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isListening ? stopVoiceSearch : startVoiceSearch}
              style={styles.voiceButton}
            >
              {isListening ? (
                <View style={styles.iconPlay}>
                  <IMAGES.MicPlay height="100%" width="100%" />
                </View>
              ) : (
                <View style={styles.iconPlay}>
                  <IMAGES.MicToPlay height="100%" width="100%" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.mainContainer}>
          {home?.loading ? (
            <LoadingScreen />
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(50) }}
              renderSectionHeader={({ section }) => (
                <>
                  {!isEmpty(section?.data) && (
                    <View style={styles.sectionHeaderContainer}>
                      <CustomText numberOfLines={1} style={styles.sectionHeader}>
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
            />
          )}
        </View>

        {/* Expanded Menus Overlay */}
        {(isSocialExpanded || isMenuExpanded) && (
          <TouchableOpacity
            style={styles.fullScreenOverlay}
            activeOpacity={1}
            onPress={() => {
              setIsSocialExpanded(false);
              setIsMenuExpanded(false);
            }}
          />
        )}
        {renderSocialMenu()}
        {renderGridMenu()}

        {/* Bottom Bar */}
        <View style={[styles.bottomBarContainer, { bottom: hp(20) + insets.bottom }]}>
          <TouchableOpacity
            style={styles.bottomBarIconContainer}
            onPress={() =>
              openLink(
                Platform.OS === 'android'
                  ? 'https://play.google.com/store/apps/details?id=com.saralgita'
                  : 'https://apps.apple.com/kz/app/saral-gita/id6754391932'
              )
            }
          >
            <IMAGES.StarOutline width={26} height={26} />
          </TouchableOpacity>
          <View style={styles.bottomBarDivider} />
          <TouchableOpacity style={styles.bottomBarIconContainer} onPress={() => navigation.navigate(Navigation.ContactUs, { fromHome: true })}>
            <IMAGES.ContactPhone width={26} height={26} />
          </TouchableOpacity>
          <View style={styles.bottomBarDivider} />
          <TouchableOpacity style={styles.bottomBarIconContainer} onPress={() => navigation.navigate(Navigation.FAQ, { fromHome: true })}>
            <IMAGES.FaqNew width={26} height={26} />
          </TouchableOpacity>
          <View style={styles.bottomBarDivider} />
          <TouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleSocialMenu}>
            <IMAGES.SocialBubbles width={26} height={26} />
          </TouchableOpacity>
          <View style={styles.bottomBarDivider} />
          <TouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleAppMenu}>
            <IMAGES.AppsGrid width={26} height={26} />
          </TouchableOpacity>
        </View>

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
    handleGetChapters: (language) => dispatch(getChapters(language)),
    handleGetRecent: () => dispatch(getRecentWatched()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Home);
