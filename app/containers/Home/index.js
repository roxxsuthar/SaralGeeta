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
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import FastImage from 'react-native-fast-image';
import Voice from '@react-native-voice/voice';

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
  const [isListening, setIsListening] = useState(false);

  const { Home: HomeMessage } = strings;
  const { currentLanguage } = language;
  const recent = get(home, 'recent');

  const sections = [
    {
      title: HomeMessage.recent.defaultMessage,
      data: !recent ? [] : [recent],
    },
    {
      title: HomeMessage.chapters.defaultMessage,
      data: filteredChapters?.filter((item) => item.id !== recent?.id) || [],
    },
  ];

  useEffect(() => {
    handleGetRecent();
    handleGetChapters();

    let mounted = true;

    // Set up voice recognition callbacks
    const voiceSetup = async () => {
      if (!mounted) return;

      try {
        // Clean up first
        await Voice.destroy().catch(() => {});
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
        Voice.onSpeechVolumeChanged = () => {};
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
          await Voice.stop().catch(() => {});
          await Voice.destroy().catch(() => {});
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

  // Voice Recognition Handlers
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
      await Voice.stop().catch(() => {});
      await Voice.destroy().catch(() => {});
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
      await Voice.destroy().catch(() => {});
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

      // Use the correct language code based on current app language
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
    (id) => {
      setShowSearch(false);
      setSearchText('');
      navigation.navigate(Navigation.Shloks, { chapterId: id });
    },
    [navigation],
  );

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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isListening ? stopVoiceSearch : startVoiceSearch}
              style={[
                styles.voiceButton,
                isListening && styles.voiceButtonActive,
              ]}
            >
              <CustomText style={styles.voiceButtonText}>
                {isListening ? '🎤' : '🎙️'}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}
        {home?.loading ? (
          <LoadingScreen />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
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
