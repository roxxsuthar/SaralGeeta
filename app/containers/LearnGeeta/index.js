import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  Dimensions,
  AppState,
  TouchableOpacity,
  Platform,
  Animated,
  BackHandler,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import stringSimilarity from 'string-similarity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStructuredSelector } from 'reselect';
import SoundRecorder from 'react-native-sound-recorder';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'redux';
import makeSelectLearnGeeta from './selectors';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../constants';
import styles from './styles';
import { getShloksDetail } from './actions';
import { makeSelectIntroVideo } from '../App/selectors';
import { introVideoWatched } from '../App/actions';
import CustomText from '../../components/CustomText';

Sound.setCategory('Playback'); // Allow audio to play in the background
const GLADIA_API_KEY = 'bbebcb87-bb37-4aff-b8ba-d5bda7a96f4c';
function LearnGeeta({
  handleGetShloksDetail,
  route,
  introVideo,
  handleIntroVideo,
  learnGeeta,
}) {
  const videoRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecordingButton, setIsRecordingButton] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const [transcription, setTranscription] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    // Lock to portrait
    Orientation.lockToLandscape();

    // Or lock to landscape
    // Orientation.lockToLandscape();

    // Cleanup
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    // Enable playback in silence mode
    Sound.setCategory('Playback', true);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        if (audio) {
          audio.pause();
        }
      } else if (nextAppState === 'active') {
        if (audio && isAudioReady && introVideo) {
          playAudio();
        }
      }
    };

    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Initial audio load
    if (learnGeeta) {
      loadAudio();
    }

    // Cleanup
    return () => {
      if (audio) {
        audio.stop();
        audio.release();
      }
      appStateSubscription.remove();
    };
  }, [learnGeeta]);

  const loadAudio = async () => {
    if (isAudioLoading) return;

    setIsAudioLoading(true);

    try {
      // Get audio file name from URL
      const audioUrl = get(learnGeeta, 'data.shlokas_voice');

      const fileName = audioUrl.split('/').pop();
      const uniqueFileName = `${get(learnGeeta, 'data.uuid')}_audio.${fileName}`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;

      // Check if file exists locally
      const fileExists = await RNFS.exists(localPath);

      if (!fileExists) {
        console.log('Downloading audio file...');
        const downloadResult = await RNFS.downloadFile({
          fromUrl: audioUrl,
          toFile: localPath,
        }).promise;

        if (downloadResult.statusCode !== 200) {
          throw new Error('Failed to download audio file');
        }
      }

      // Release existing audio if any
      if (audio) {
        audio.release();
      }

      // Create new sound instance
      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          setIsAudioLoading(false);
          return;
        }

        sound.setVolume(1.0);
        setAudio(sound);
        setIsAudioReady(true);
        setIsAudioLoading(false);

        // Auto play if conditions are met
        if (introVideo && AppState.currentState === 'active') {
          playAudio();
        }
      });
    } catch (err) {
      setIsAudioLoading(false);
      setIsAudioReady(false);
    }
  };

  const playAudio = () => {
    if (!audio || !isAudioReady) {
      console.log('Audio not ready to play');
      return;
    }

    // Don't play if already playing
    if (audio.isPlaying()) {
      return;
    }

    audio.play((success) => {
      if (!success) {
        console.error('Audio playback failed');
        // Optional: Implement retry logic here
      }
    });
  };

  // Effect to handle auto-play when conditions are met
  useEffect(() => {
    if (isAudioReady && introVideo && AppState.currentState === 'active') {
      playAudio();
    }
  }, [isAudioReady, introVideo]);

  // Effect to handle cleanup
  useEffect(() => {
    return () => {
      if (audio) {
        audio.stop();
        audio.release();
      }
    };
  }, [audio]);

  useEffect(() => {
    handleGetShloksDetail({ shlok_id: get(route, 'params.uuid') });
  }, [route]);

  const handleIntroPlay = useCallback(() => {
    handleIntroVideo();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      // Navigate to the previous screen
      if (audio) {
        audio.stop();
      }
      navigation.goBack();
      stopRecording();
      return true; // Prevent default back behavior
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [navigation, audio]);

  const REQUIRED_PERMISSIONS = Platform.select({
    android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
    ios: [PERMISSIONS.IOS.MICROPHONE],
  });

  const requestPermissions = async () => {
    try {
      // First check if we already have permissions
      const checkResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => check(permission)),
      );

      // If all permissions are already granted, return true
      if (checkResults.every((result) => result == RESULTS.GRANTED)) {
        console.log('All permissions already granted');
        return true;
      } else {
        checkResults.every((result) => console.log('-------', result));
      }

      // Request permissions
      const requestResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => request(permission)),
      );

      console.log('Permission Results:', requestResults);

      // Check for "never_ask_again" or "blocked"
      const hasBlocked = requestResults.some(
        (result) => result == RESULTS.BLOCKED || result == RESULTS.DENIED,
      );

      if (hasBlocked) {
        Alert.alert(
          'Permissions Required',
          'Please enable permissions from app settings to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => openSettings(),
            },
          ],
        );
        return false;
      }

      const allGranted = requestResults.every(
        (result) => result == RESULTS.GRANTED,
      );

      if (!allGranted) {
        // Alert.alert(
        //   'Permissions Required',
        //   'Please grant all permissions to use this feature.',
        //   [{ text: 'OK' }],
        // );
        return false;
      }

      return true;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  // Use it in your useEffect
  useEffect(() => {
    const checkPermissions = async () => {
      const hasPermissions = await requestPermissions();
      console.log('Initial permissions check:', hasPermissions);
    };

    checkPermissions();
  }, []);

  const getTimestampedFileName = (extension) => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-'); // Format: YYYY-MM-DDTHH-MM-SS
    return `audio_${timestamp}.${extension}`;
  };

  const startRecording = async () => {
    try {
      blinkingBar();
      console.log('Attempting to start recording...');

      // Ensure the recording button state is correct
      setIsRecordingButton(true);

      // Check permissions
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.error('Permissions not granted.');
        return;
      }

      const fileName = getTimestampedFileName('wav');
      const path = Platform.select({
        ios: fileName, // iOS: In the app's temporary directory
        android: `${RNFS.DocumentDirectoryPath}/${fileName}`, // Android: Document directory
      });

      // Start recording
      SoundRecorder.start(path)
        .then(() => {
          console.log('Recording successfully started at:', path);
        })
        .catch((error) => {
          console.error('Failed to start recording:', error);
          setIsRecordingButton(false);
        });
    } catch (error) {
      console.error('Error starting recorder:', error.message);
      setIsRecordingButton(false);
    }
  };

  const uploadAudioToGladia = async (filePath, gladiaKey) => {
    try {
      // Ensure the file exists
      const fileExists = await RNFS.exists(filePath);
      console.log('File exists:', fileExists);
      if (!fileExists) {
        throw new Error('File not found at the specified path.');
      }

      // For Android, make sure the path includes 'file://' prefix
      const fileUri =
        Platform.OS === 'android' ? `file://${filePath}` : filePath;

      // Prepare the form data
      const formData = new FormData();
      formData.append('audio', {
        uri: fileUri,
        type: 'audio/wav', // Update this if your audio file has a different type
        name: filePath.split('/').pop(),
      });

      // Set headers
      const headers = {
        'Content-Type': 'multipart/form-data',
        'x-gladia-key': gladiaKey,
      };

      // Send the POST request
      const response = await fetch('https://api.gladia.io/v2/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      // Parse the response
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload audio file.');
      }

      console.log('Upload successful:', result);
      return result; // This typically includes the URL of the uploaded file
    } catch (error) {
      console.error('Error uploading audio file:', error.message);
      throw error;
    }
  };

  async function startTranscription(url) {
    const gladiaKey = 'bbebcb87-bb37-4aff-b8ba-d5bda7a96f4c';
    const requestData = {
      audio_url: url,
      audio_to_llm: true,
      language: 'sa',
      detect_language: false,
      audio_to_llm_config: {
        prompts: [`${get(learnGeeta, 'data.shlokas_text')}`],
      },
    };
    const gladiaUrl = 'https://api.gladia.io/v2/pre-recorded/';
    const headers = {
      'x-gladia-key': gladiaKey,
      'Content-Type': 'application/json',
    };

    console.log('- Sending initial request to Gladia API...');
    const initialResponse = await makeFetchRequest(gladiaUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
    });

    console.log('Initial response with Transcription ID :', initialResponse);

    if (initialResponse.result_url) {
      await pollForResult(initialResponse.result_url, headers);
    }
  }

  const stopRecording = async () => {
    try {
      // Check if the recording state is active
      if (!isRecordingButton) {
        console.warn('Recorder is not active. Cannot stop recording.');
        return;
      }

      console.log('Attempting to stop recording...');

      // Attempt to stop the recorder
      SoundRecorder.stop()
        .then(async (result) => {
          if (!result) {
            console.error('No active recording session to stop.');
            return;
          }

          console.log('Recording stopped successfully:', result);

          // Clean the file path and verify its existence
          const cleanedPath = result?.path;
          console.log('Cleaned file path:', cleanedPath);

          const fileExists = await RNFS.exists(cleanedPath);
          if (!fileExists) {
            console.error('File not found at the specified path:', cleanedPath);
            throw new Error('File not found at the specified path.');
          }

          // Proceed with uploading the audio file
          console.log('Uploading audio to Gladia...');
          uploadAudioToGladia(cleanedPath, GLADIA_API_KEY)
            .then((uploadResult) => {
              console.log('File uploaded successfully:', uploadResult);
              startTranscription(uploadResult?.audio_url);
            })
            .catch((error) => {
              console.error('File upload failed:', error.message);
            });

          // Update the recording button state
          setIsRecordingButton(false);
        })
        .catch((error) => {
          console.error('Error stopping the recording:', error);
        });
    } catch (error) {
      console.error('Error stopping recorder:', error.message);
    }
  };

  async function makeFetchRequest(url, options) {
    const response = await fetch(url, options);
    return response.json();
  }

  async function pollForResult(resultUrl, headers) {
    while (true) {
      console.log('Polling for results...');
      const pollResponse = await makeFetchRequest(resultUrl, {
        headers,
      });

      if (pollResponse.status === 'done') {
        console.log('- Transcription done: \n');
        const audioToLlmResults = pollResponse.result.audio_to_llm;
        const textOriginal = audioToLlmResults?.results[0]?.results?.prompt;
        const textTranslated = audioToLlmResults?.results[0]?.results?.response;
        const getSimilarityPercentage = (originalText, translatedText) => {
          const similarity = stringSimilarity.compareTwoStrings(
            originalText,
            translatedText,
          );
          return (similarity * 100).toFixed(2); // Convert to percentage
        };

        const similarityPercentage = getSimilarityPercentage(
          textOriginal,
          textTranslated,
        );

        console.log('similarityPercentage status : ', similarityPercentage);
        setTranscription(similarityPercentage);
        break;
      } else {
        console.log('Transcription status : ', pollResponse.status);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  const [opacity] = useState(new Animated.Value(1));

  const blinkingBar = useCallback(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    blink.start();

    return () => blink.stop();
  }, [opacity]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={['#000000', '#000000']}
        style={styles.gradientBorder}
      >
        <View style={[styles.videoWrapper, { aspectRatio }]}>
          <Video
            source={
              isEqual(introVideo, false)
                ? {
                    uri: 'https://saral-gita.s3.ap-south-1.amazonaws.com/video/ganeshji/Ganesh_ji_intro.m3u8',
                    type: 'm3u8',
                    headers: {
                      'User-Agent': 'Mozilla/5.0',
                    },
                  }
                : {
                    uri: `${get(learnGeeta, 'data.shlokas_video_hls')}`,
                    type: 'm3u8',
                    headers: {
                      'User-Agent': 'Mozilla/5.0',
                    },
                  }
            }
            ref={videoRef}
            style={styles.backgroundVideo}
            resizeMode="contain"
            paused={!isAudioReady || !isVideoReady}
            volume={1.0}
            audioFocus={false}
            ignoreSilentSwitch="ignore"
            mixWithOthers={true}
            playInBackground={false}
            playWhenInactive={false}
            onError={() => {
              setIsVideoReady(false);
            }}
            onLoad={(data) => {
              console.log('Video loaded:', data);
              setIsVideoReady(true);
              videoRef.current?.seek(0);
            }}
            onEnd={() => {
              isEqual(introVideo, false) && setIsButton(true);
              console.log('Video ended');
              isEqual(introVideo, false) && handleIntroPlay();
            }}
            onPlaybackStalled={() => {
              console.log('Playback stalled');
              // Attempt to recover from stall
              if (videoRef.current) {
                videoRef.current.seek(0);
              }
            }}
            onReadyForDisplay={() => {
              console.log('Ready for display');
              setIsVideoReady(true);
            }}
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 2500,
              bufferForPlaybackAfterRebufferMs: 5000,
            }}
            // controls={true}
            fullscreen={false}
            progressUpdateInterval={250}
            repeat={false}
            poster="path_to_placeholder_image" // Add a placeholder image while video loads
            posterResizeMode="contain"
          />
        </View>
        {introVideo && (
          <>
            <View style={styles.shlokBackground}>
              <IMAGES.ShlokBackground height="100%" width="100%" />
            </View>
            <CustomText style={styles.shlokText}>
              {get(learnGeeta, 'data.shlokas_text')}
            </CustomText>
          </>
        )}

        {introVideo && !isButton && (
          <>
            {isRecordingButton && (
              <View style={styles.container3}>
                <Animated.View style={[styles.dot, { opacity }]} />
              </View>
            )}
            <View style={styles.buttonContainerStyles}>
              {!isRecordingButton ? (
                <>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={startRecording}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonIconStyle}>
                      <IMAGES.MicIcon height="100%" width="100%" />
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={stopRecording}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonIconStyle}>
                    <IMAGES.PauseIcon height="100%" width="100%" />
                  </View>
                </TouchableOpacity>
              )}
              {!isEmpty(transcription) && (
                <CustomText style={styles.translationText}>
                  Result: {transcription}
                </CustomText>
              )}
            </View>
          </>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

LearnGeeta.propTypes = {
  navigation: PropTypes.object,
  handleGetShloksDetail: PropTypes.func,
  handleIntroVideo: PropTypes.func,
  route: PropTypes.object,
  introVideo: PropTypes.bool,
  learnGeeta: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
  introVideo: makeSelectIntroVideo(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetShloksDetail: (payload) => dispatch(getShloksDetail(payload)),
    handleIntroVideo: () => dispatch(introVideoWatched()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LearnGeeta);
