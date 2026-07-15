/** * *
Home
* */

import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  NativeModules,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import Orientation from 'react-native-orientation-locker';
const { OrientationModule } = NativeModules;
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import Voice from '@dev-amirzubair/react-native-voice';
import { useFocusEffect } from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import makeSelectHome from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { setFontFamily } from '../../utils/device';
import { FONTS, IMAGES, COLORS } from '../../constants';
import strings from '../../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CopilotProvider, CopilotStep, walkthroughable, useCopilot } from 'react-native-copilot';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);
import { makeSelectAppLanguage } from '../App/selectors';
import { getChapters, getRecentWatched } from './actions';
import { Navigation } from '../../constants/constants';
import { DrawerActions } from '@react-navigation/native';
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
  

  const { start, copilotEvents } = useCopilot();
  const hasStartedGuide = useRef(false);
  const startRef = useRef(start);
  const copilotEventsRef = useRef(copilotEvents);

  startRef.current = start;
  copilotEventsRef.current = copilotEvents;

  useEffect(() => {
    const checkTutorial = async () => {
      if (hasStartedGuide.current) return;
      if (filteredChapters && filteredChapters.length > 0) {
        try {
          await AsyncStorage.removeItem('HAS_SEEN_HOME_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_SHLOKS_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_LEARNGEETA_TUTORIAL');
        await AsyncStorage.removeItem('HAS_SEEN_BHAGWAN_TUTORIAL');
        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_HOME_TUTORIAL');
          if (!hasSeen) {
            hasStartedGuide.current = true;
            setTimeout(() => {
              startRef.current();
            }, 1500);
          }
        } catch (e) {}
      }
    };
    checkTutorial();
  }, [filteredChapters]);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_HOME_TUTORIAL', 'true').catch(() => {});
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);

  const insets = useSafeAreaInsets();
  const pulseScale = useSharedValue(1);
  const listeningTimerRef = useRef(null);

  const clearListeningTimer = () => {
    if (listeningTimerRef.current) {
      clearTimeout(listeningTimerRef.current);
      listeningTimerRef.current = null;
    }
  };

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  useEffect(() => {
    if (isListening) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(pulseScale);
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [isListening]);

  const { Home: HomeMessage, HomeBottomBar } = strings;
  const { currentLanguage } = language;
  const recent = get(home, 'recent');

  const { width: windowWidth } = useWindowDimensions();
  const numColumns = windowWidth > 600 ? 2 : 1;

  const chaptersData = React.useMemo(() => {
    return filteredChapters?.filter((item) => item.id !== recent?.id) || [];
  }, [filteredChapters, recent]);

  // Chunking helper for grid display
  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size),
    );

  const processedChapters = React.useMemo(() => {
    return numColumns > 1 ? chunkArray(chaptersData, numColumns) : chaptersData;
  }, [chaptersData, numColumns]);

  const listData = React.useMemo(() => {
    const data = [];
    if (recent) {
      data.push({ type: 'header', title: HomeMessage.recent.defaultMessage });
      data.push({ type: 'recent', item: recent });
    }
    if (processedChapters && processedChapters.length > 0) {
      data.push({ type: 'header', title: HomeMessage.chapters.defaultMessage });
      processedChapters.forEach((chunk) => {
        data.push({ type: 'chapterRow', item: chunk });
      });
    }
    return data;
  }, [recent, processedChapters, HomeMessage]);

  useFocusEffect(
    useCallback(() => {
      // Ensure orientation is locked to portrait
      if (Platform.OS === 'ios') {
        OrientationModule.lockToPortrait();
      } else {
        Orientation.lockToPortrait();
      }

      handleGetRecent();
      handleGetChapters(currentLanguage);

      return () => {
        // Only clear states when leaving the screen
        setIsSocialExpanded(false);
        setIsMenuExpanded(false);
        setShowSearch(false);
        setSearchText('');
      };
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
        Voice.onSpeechPartialResults = onSpeechPartialResults;
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
    if (home?.data && searchText.trim() === '') {
      setFilteredChapters(home.data);
    }
  }, [home?.data, searchText]);

  useEffect(() => {
    if (!home?.data) return;

    if (searchText.trim() === '') {
      setFilteredChapters(home.data);
    } else {
      const query = searchText.toLowerCase().trim();
      const filtered = home.data.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const serialMatch = item.serial?.toString() === query ||
          (query.startsWith('chapter') && item.serial?.toString() === query.replace('chapter', '').trim()) ||
          (query.startsWith('अध्याय') && item.serial?.toString() === query.replace('अध्याय', '').trim());

        return nameMatch || descMatch || serialMatch;
      });
      setFilteredChapters(filtered);
    }
  }, [searchText, home?.data]);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    // onSpeechEnd can fire before results on some devices. 
    // We let onSpeechResults or onSpeechError handle the state reset for a smoother UI.
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0].trim();
      setSearchText(recognizedText);
      // If we got a final result, we can stop listening
      clearListeningTimer();
      setIsListening(false);
    }
  };

  const onSpeechPartialResults = (e) => {
    if (e.value && e.value.length > 0) {
      setSearchText(e.value[0].trim());
      
      // Reset the silence timer every time user speaks
      clearListeningTimer();
      listeningTimerRef.current = setTimeout(() => {
        setIsListening(false);
        Voice.stop().catch(() => {});
      }, 5000);
    }
  };

  const onSpeechError = async (e) => {
    // Only reset state if it's a real error that stops the session
    console.log('Voice Search Error: ', e);
    
    // Code 7 is "No match", which can happen if the user is silent briefly.
    // We ignore this and let our 10s timer or final results handle the state.
    if (e.error?.code === '7' || e.error?.code === '8' || e.error?.code === '9') {
      return;
    }

    clearListeningTimer();
    setIsListening(false);
  };

  const requestMicrophonePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (result === RESULTS.GRANTED) {
          return true;
        }
        const requestResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
        return requestResult === RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.MICROPHONE);
        if (result === RESULTS.GRANTED) {
          return true;
        }
        const requestResult = await request(PERMISSIONS.IOS.MICROPHONE);
        return requestResult === RESULTS.GRANTED;
      }
      return false;
    } catch (error) {
      console.log('Permission Error: ', error);
      return false;
    }
  };

  const startVoiceSearch = async () => {
    if (isListening) {
      stopVoiceSearch();
      return;
    }

    try {
      // 1. Check/Request permissions FIRST
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
           alert(currentLanguage === 'hindi' ? 'कृपया माइक्रोफ़ोन अनुमति सक्षम करें' : 'Please enable microphone permission in settings');
        }
        return;
      }

      // 2. If granted, then set UI states
      setIsListening(true);
      setSearchText('');

      // Ensure we don't stay listening forever, but give at least 10 seconds
      clearListeningTimer();
      listeningTimerRef.current = setTimeout(() => {
        setIsListening(false);
      }, 10000);

      const languageCode = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';

      // Advanced cleanup before starting a new session to prevent fluctuation
      try {
        await Voice.stop().catch(() => {});
        await Voice.destroy().catch(() => {});
      } catch (e) { /* ignore */ }

      // Small delay to let the native engine reset fully
      setTimeout(async () => {
        try {
          await Voice.start(languageCode, {
            EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS: 10000,
            EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 5000,
            EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 5000,
          });
        } catch (error) {
          console.log('Voice Start Error: ', error);
          setIsListening(false);
        }
      }, 250);

    } catch (error) {
      console.log('Voice Search Error: ', error);
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

  const renderChapterCard = useCallback((item) => (
    <CopilotStep
      text={strings.Copilot.homeFirstChapter.defaultMessage}
      order={3}
      name="firstChapter"
      active={item.serial === 1}
    >
      <CopilotTouchableOpacity
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
      </CopilotTouchableOpacity>
    </CopilotStep>
  ), [currentLanguage, HomeMessage, navigateToShloks]);

  const renderItemBasedOnSection = useCallback((title, item) => {
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
            <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer} onPress={() => navigateToLearnShlock(item)}>
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
  }, [HomeMessage, currentLanguage, navigateToLearnShlock, numColumns, renderChapterCard]);

  const renderListItem = useCallback(({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeaderContainer}>
          <CustomText numberOfLines={1} style={styles.sectionHeader}>
            {item.title}
          </CustomText>
        </View>
      );
    } else if (item.type === 'recent') {
      return renderItemBasedOnSection(HomeMessage.recent.defaultMessage, item.item);
    } else if (item.type === 'chapterRow') {
      return renderItemBasedOnSection(HomeMessage.chapters.defaultMessage, item.item);
    }
    return null;
  }, [renderItemBasedOnSection, HomeMessage]);

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
          <CopilotStep
            text={strings.Copilot.homeDrawerBtn.defaultMessage}
            order={1}
            name="drawerBtn"
          >
            <CopilotTouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              activeOpacity={0.8}
              style={styles.headerSubContainer}
            >
              <View style={styles.icon}>
                <IMAGES.ThreeBars height="100%" width="100%" />
              </View>
            </CopilotTouchableOpacity>
          </CopilotStep>

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
            <CopilotStep
              text={strings.Copilot.homeSearchBar.defaultMessage}
              order={2}
              name="searchBtn"
            >
              <CopilotTouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowSearch((prev) => !prev)}
                style={styles.headerSearchContainer}
              >
                <View style={styles.icon}>
                  <IMAGES.SearchIcon height="100%" width="100%" />
                </View>
              </CopilotTouchableOpacity>
            </CopilotStep>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.icon}>
              <IMAGES.SearchIcon height="100%" width="100%" fill="#fff" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder={isListening
                ? (currentLanguage === 'hindi' ? 'बोलिए...' : 'Listening...')
                : (currentLanguage === 'hindi' ? 'अध्याय खोजें...' : 'Search Chapters...')
              }
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={isListening ? (searchText || '') : searchText}
              onChangeText={setSearchText}
              allowFontScaling={false}
              autoFocus
            />
            {searchText !== '' && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}
              >
                <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <CustomText style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 20 }}>✕</CustomText>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isListening ? stopVoiceSearch : startVoiceSearch}
              style={[styles.voiceButton, isListening && { backgroundColor: 'rgba(228, 134, 22, 0.4)' }]}
            >
              <Animated.View style={[styles.iconPlay, pulseAnimStyle]}>
                {isListening ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <IMAGES.MicToPlay height="100%" width="100%" />
                )}
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.mainContainer}>
          {home?.loading ? (
            <LoadingScreen />
          ) : filteredChapters.length === 0 && searchText.length > 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
              <CustomText style={{ color: COLORS.gray, fontSize: 18, fontFamily: 'Outfit-Medium' }}>
                {currentLanguage === 'hindi' ? 'कोई परिणाम नहीं मिला' : 'No results found'}
              </CustomText>
              <TouchableOpacity onPress={() => setSearchText('')} style={{ marginTop: 10 }}>
                <CustomText style={{ color: COLORS.orange, fontSize: 14, fontFamily: 'Outfit-Bold' }}>
                  {currentLanguage === 'hindi' ? 'खोज साफ़ करें' : 'Clear Search'}
                </CustomText>
              </TouchableOpacity>
            </View>
          ) : (
            <FlashList
              data={listData}
              keyExtractor={(item, index) => item.type === 'header' ? `header-${index}` : (item.item?.id || index.toString())}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: hp(100) }}
              estimatedItemSize={200}
              renderItem={renderListItem}
              ItemSeparatorComponent={ItemSeparator}
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
          <CopilotStep
            text={strings.Copilot.homeBottomBar.defaultMessage}
            order={4}
            name="bottomBar"
          >
            <CopilotTouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleAppMenu}>
              <IMAGES.AppsGrid width={26} height={26} />
            </CopilotTouchableOpacity>
          </CopilotStep>
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

const MemoizedHome = React.memo(Home);

function HomeWrapper(props) {
  const currentLanguage = props.language?.currentLanguage;
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
      <MemoizedHome {...props} />
    </CopilotProvider>
  );
}

HomeWrapper.propTypes = {
  language: PropTypes.object,
};

export default compose(withConnect)(HomeWrapper);
