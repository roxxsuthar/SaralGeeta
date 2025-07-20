import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  AppState,
  TouchableOpacity,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
import Lottie from 'lottie-react-native';
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
import { getShloksDetail, saveResult } from './actions';
import {
  makeSelectIdealDetails,
  makeSelectIntroVideo,
  makeSelectUser,
} from '../App/selectors';
import { introVideoWatched } from '../App/actions';
import CustomText from '../../components/CustomText';
import makeSelectShloks from '../Shloks/selectors';
import { ImageBackground } from 'react-native';
import { getShloks } from '../Shloks/actions';

Sound.setCategory('Playback');
const GLADIA_API_KEY = 'bbebcb87-bb37-4aff-b8ba-d5bda7a96f4c';
function LearnGeeta({
  handleGetShloksDetail,
  route,
  isIntroVideoPlayed,
  handleIntroVideo,
  learnGeeta,
  user,
  shloks,
  introVideo,
  handleSaveResult,
  handleGetShloks,
}) {
  const videoRef = useRef(null);
  const [audio, setAudio] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecordingButton, setIsRecordingButton] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForTranslation, setWaitingForTranslation] = useState('');
  const [shlokIndex, setShlokIndex] = useState();

  const [videoUrl, setVideoUrl] = useState(
    learnGeeta?.data?.media?.hls_male_path,
  );

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const animationRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    handleGetShloks({ chapterId: get(route, 'params.chapter.id') });
  }, []);

  useEffect(() => {
    setShlokIndex(
      shloks?.data?.findIndex((item) => item.id === learnGeeta?.data?.id),
    );
  }, [shloks, learnGeeta]);

  useEffect(() => {
    Orientation.lockToLandscape();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    Sound.setCategory('Playback', true);

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        if (audio) {
          audio.pause();
        }
      } else if (nextAppState === 'active') {
        if (
          audio &&
          isAudioReady &&
          isIntroVideoPlayed &&
          isVideoReady &&
          !isLoading &&
          !isButton
        ) {
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
      setVideoUrl(get(learnGeeta, 'data.media.hls_male_path'));
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

  const loadAudio = useCallback(async () => {
    if (isAudioLoading) return;

    setIsAudioLoading(true);

    try {
      const audioUrl = get(learnGeeta, 'data.media.audio');

      const fileName = audioUrl.split('/').pop();
      const uniqueFileName = `${get(learnGeeta, 'data.id')}_audio.${fileName.slice(-3)}`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;

      const fileExists = await RNFS.exists(localPath);

      if (!fileExists) {
        const downloadResult = await RNFS.downloadFile({
          fromUrl: audioUrl,
          toFile: localPath,
        }).promise;

        if (downloadResult.statusCode !== 200) {
          throw new Error('Failed to download audio file');
        }
      }

      if (audio) {
        audio.release();
      }

      // Create new sound instance
      const sound = new Sound(localPath, '', (error) => {
        if (error) {
          setIsAudioLoading(false);
          return;
        }

        sound.setVolume(2.0);
        setAudio(sound);
        setIsAudioReady(true);
        setIsAudioLoading(false);
      });
    } catch (err) {
      setIsAudioLoading(false);
      setIsAudioReady(false);
    }
  }, [learnGeeta, audio]);

  useEffect(() => {
    if (!isIntroVideoPlayed) {
      videoRef.current?.seek(0);
    } else if (
      isAudioReady &&
      isVideoReady &&
      AppState.currentState === 'active' &&
      !isLoading &&
      !isButton
    ) {
      playAudio();
      videoRef.current?.seek(0);
    }
  }, [isAudioReady, isVideoReady, isLoading, isButton]);

  const playAudio = () => {
    if (!audio || !isAudioReady) {
      console.log('Audio not ready to play');
      return;
    }
    if (audio.isPlaying()) {
      return;
    }

    audio.play((success) => {});
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.stop();
        audio.release();
      }
    };
  }, [audio]);

  useEffect(() => {
    handleGetShloksDetail({ shlok: get(route, 'params') });
  }, [route]);

  const handleIntroPlay = useCallback(() => {
    handleIntroVideo();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (audio) {
        audio.stop();
        SoundRecorder.stop();
      }
      navigation.goBack();
      return true;
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
      const checkResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => check(permission)),
      );

      if (checkResults.every((result) => result == RESULTS.GRANTED)) {
        console.log('All permissions already granted');
        return true;
      }

      const requestResults = await Promise.all(
        REQUIRED_PERMISSIONS.map((permission) => request(permission)),
      );

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
        return false;
      }

      return true;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

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
      setTranscription('');
      audio.stop();
      audio.release();
      videoRef.current.seek(0);
      setIsVideoPlaying(false);
      setIsRecordingButton(true);
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
          // console.error('Failed to start recording:', error);
          setIsRecordingButton(false);
        });
    } catch (error) {
      // console.error('Error starting recorder:', error.message);
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
      // console.error('Error uploading audio file:', error.message);
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
        prompts: [`${get(learnGeeta, 'data.shloke')}`],
      },
    };
    const gladiaUrl = 'https://api.gladia.io/v2/pre-recorded/';
    const headers = {
      'x-gladia-key': gladiaKey,
      'Content-Type': 'application/json',
    };

    console.log('- Sending initial request to Gladia API...');
    setWaitingForTranslation(true);
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
    videoRef.current.pause();
    setIsVideoPlaying(true);
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
          // console.error('No active recording session to stop.');
          return;
        }

        console.log('Recording stopped successfully:', result);

        // Clean the file path and verify its existence
        const cleanedPath = result?.path;
        console.log('Cleaned file path:', cleanedPath);

        const fileExists = await RNFS.exists(cleanedPath);
        if (!fileExists) {
          // console.error('File not found at the specified path:', cleanedPath);
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
            // console.error('File upload failed:', error.message);
          });

        // Update the recording button state
        setIsRecordingButton(false);
      })
      .catch((error) => {
        // console.error('Error stopping the recording:', error);
      });
  };

  async function makeFetchRequest(url, options) {
    const response = await fetch(url, options);
    return response.json();
  }

  async function pollForResult(resultUrl, headers) {
    while (true) {
      const pollResponse = await makeFetchRequest(resultUrl, {
        headers,
      });

      if (pollResponse.status === 'done') {
        setWaitingForTranslation(false);

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

        setTranscription(similarityPercentage);

        const obj = {
          result: similarityPercentage,
          media: get(learnGeeta, 'data.media.id', ''),
        };
        handleSaveResult(obj);
        break;
      } else {
        console.log('Transcription status : ', pollResponse.status);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  const isVideoPaused = useCallback(() => {
    if (isVideoPlaying) {
      return isVideoPlaying;
    } else {
      return !isAudioReady && !isVideoReady;
    }
  }, [isVideoPlaying, isAudioReady, isVideoReady]);

  useEffect(() => {
    if (isIntroVideoPlayed)
      setVideoUrl(get(learnGeeta, 'data.media.hls_male_path'));
  }, [isIntroVideoPlayed]);

  const colorArray = ['#9C27B0', '#4CAF50', '#2196F3', '#FF9800'];

  const getPreviousShlok = useCallback(() => {
    setIsButton(false);
    setTranscription('');
    setIsVideoPlaying(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex - 1]?.id } });
  }, [shloks, shlokIndex]);

  const getNextShlok = useCallback(() => {
    setIsButton(false);
    setTranscription('');
    setIsVideoPlaying(false);
    handleGetShloksDetail({ shlok: { id: shloks?.data[shlokIndex + 1]?.id } });
  }, [shloks, shlokIndex]);

  const playAgain = useCallback(() => {
    Sound.setCategory('Playback', true);
    setIsButton(false);
    setTranscription('');
    setIsVideoPlaying(false);
    setVideoUrl(get(learnGeeta, 'data.media.hls_male_path'));
    setIsVideoReady(false);
    loadAudio();
  }, [learnGeeta]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
        hidden={true}
      />
      {get(learnGeeta, 'loading') ? (
        <View style={styles.cloudAnimationContainer}>
          <Lottie
            ref={animationRef}
            source={IMAGES.TranslationAnimation} // Path to your Lottie animation JSON
            autoPlay
            loop
            style={styles.cloudAnimation}
          />
        </View>
      ) : (
        <ImageBackground
          source={IMAGES.MainScreenBackground}
          style={styles.gradientBorder}
          resizeMode="cover" // Similar to background-size in CSS
        >
          <View style={styles.videoWrapper}>
            <Video
              source={
                isEqual(isIntroVideoPlayed, false)
                  ? {
                      uri: introVideo?.hls_male_path,
                      type: 'm3u8',
                      headers: {
                        'User-Agent': 'Mozilla/5.0',
                      },
                    }
                  : {
                      uri: videoUrl,
                      type: 'm3u8',
                      headers: {
                        'User-Agent': 'Mozilla/5.0',
                      },
                    }
              }
              ref={videoRef}
              style={styles.backgroundVideo}
              resizeMode="cover"
              paused={isVideoPaused()}
              volume={1.0}
              audioFocus={false}
              ignoreSilentSwitch="ignore"
              mixWithOthers={true}
              playInBackground={false}
              playWhenInactive={false}
              setFullScreen={true}
              onError={() => {
                setIsVideoReady(false);
                audio.pause();
              }}
              onLoadStart={() => {
                setIsLoading(true);
              }}
              onLoad={(data) => {
                setIsLoading(false);
                console.log('Video loaded:', data);
                setIsVideoReady(true);
              }}
              onEnd={() => {
                console.log('video ended');
                isEqual(isIntroVideoPlayed, true) && setIsButton(true);
                isEqual(isIntroVideoPlayed, false) && handleIntroPlay();
                if (isIntroVideoPlayed) {
                  setIsVideoPlaying(true);
                  if (isEqual(get(user, 'gender'), 'male')) {
                    setVideoUrl(get(learnGeeta, 'data.media.hls_male_user'));
                    videoRef.current.pause();
                  } else {
                    get(learnGeeta, 'data.media.hls_female_user')
                      ? setVideoUrl(
                          get(learnGeeta, 'data.media.hls_female_user'),
                        )
                      : setVideoUrl(
                          get(learnGeeta, 'data.media.hls_male_user'),
                        );
                    videoRef.current.pause();
                  }
                }
              }}
              onPlaybackStateChanged={(e) => {
                if (
                  isEqual(e?.isPlaying, false) &&
                  !isVideoPlaying &&
                  isIntroVideoPlayed
                ) {
                  if (audio) {
                    audio.pause();
                  }
                } else {
                  if (audio && !isVideoPlaying && isIntroVideoPlayed) {
                    audio.play();
                  }
                }
              }}
              onPlaybackResume={() => {
                console.log('Playback resumed');
                // Resume the audio when the video plays again
                if (audio && !audio.isPlaying()) {
                  audio.play();
                }
              }}
              bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 50000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000,
              }}
              controls={false}
              progressUpdateInterval={250}
              repeat={false}
              poster="path_to_placeholder_image" // Add a placeholder image while video loads
              posterResizeMode="cover"
            />
          </View>
          {waitingForTranslation && (
            <View style={styles.cloudAnimationContainer}>
              <Lottie
                ref={animationRef}
                source={IMAGES.TranslationAnimation} // Path to your Lottie animation JSON
                autoPlay
                loop
                style={styles.cloudAnimation}
              />
            </View>
          )}
          {isButton && !isRecordingButton && (
            <View style={styles.controlContainer}>
              <TouchableOpacity
                style={styles.controlButtonStyle}
                onPress={!(shlokIndex < 1) ? getPreviousShlok : null}
                activeOpacity={0.8}
              >
                {!(shlokIndex < 1) && (
                  <View style={styles.controlIconStyle}>
                    <IMAGES.WhiteLeftArrowIcon height="100%" width="100%" />
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButtonStyle1}
                onPress={playAgain}
                activeOpacity={0.8}
              >
                <View style={styles.controlIconStyle}>
                  <IMAGES.ReplayButton height="100%" width="100%" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButtonStyle}
                onPress={() =>
                  shlokIndex + 1 < shloks?.data?.length ? getNextShlok() : null
                }
                activeOpacity={0.8}
              >
                {shlokIndex + 1 < shloks?.data?.length && (
                  <View style={styles.controlIconStyle}>
                    <IMAGES.WhiteRightArrowIcon height="100%" width="100%" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
          {isIntroVideoPlayed && (
            <>
              {isLoading ? (
                <View style={styles.cloudAnimationContainer}>
                  <Lottie
                    ref={animationRef}
                    source={IMAGES.TranslationAnimation} // Path to your Lottie animation JSON
                    autoPlay
                    loop
                    style={styles.cloudAnimation}
                  />
                </View>
              ) : (
                <View style={styles.overlay}>
                  <View style={styles.svgImageContainer}>
                    <IMAGES.ShlokBackground width="100%" height="100%" />
                    {!isEmpty(transcription) && (
                      <CustomText style={styles.translationText}>
                        Result: {transcription}
                      </CustomText>
                    )}
                    {isEmpty(transcription) &&
                      learnGeeta?.data?.shloke_parts?.map((item, idx) => (
                        <CustomText
                          key={idx}
                          style={{
                            ...styles.overlayText,
                            color: colorArray[idx],
                          }}
                        >
                          {item}
                        </CustomText>
                      ))}
                    {isButton && (
                      <>
                        {!isRecordingButton ? (
                          <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={startRecording}
                            activeOpacity={0.8}
                          >
                            <View style={styles.buttonIconStyle}>
                              <IMAGES.MicIcon height="100%" width="100%" />
                            </View>
                          </TouchableOpacity>
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
                        {isRecordingButton && (
                          <Lottie
                            ref={animationRef}
                            source={IMAGES.PlayerLottie}
                            autoPlay
                            loop
                            style={styles.animation}
                          />
                        )}
                      </>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </ImageBackground>
      )}
    </SafeAreaView>
  );
}

LearnGeeta.propTypes = {
  navigation: PropTypes.object,
  handleGetShloksDetail: PropTypes.func,
  handleIntroVideo: PropTypes.func,
  route: PropTypes.object,
  isIntroVideoPlayed: PropTypes.bool,
  learnGeeta: PropTypes.object,
  user: PropTypes.object,
  shloks: PropTypes.object,
  introVideo: PropTypes.object,
  handleSaveResult: PropTypes.func,
  handleGetShloks: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  learnGeeta: makeSelectLearnGeeta(),
  isIntroVideoPlayed: makeSelectIntroVideo(),
  user: makeSelectUser(),
  shloks: makeSelectShloks(),
  introVideo: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetShloksDetail: (payload) => dispatch(getShloksDetail(payload)),
    handleIntroVideo: () => dispatch(introVideoWatched()),
    handleSaveResult: (payload) => dispatch(saveResult(payload)),
    handleGetShloks: (payload) => dispatch(getShloks(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(LearnGeeta);
