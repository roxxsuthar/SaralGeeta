import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import { get } from 'lodash';
import styles from '../styles';
import {
  VIDEO_BUFFER_CONFIG,
  VIDEO_PROGRESS_UPDATE_INTERVAL,
} from '../../../constants/constants';

const VideoPlayer = ({
  videoRef,
  videoSource,
  isVideoPaused,
  onError,
  onLoadStart,
  onLoad,
  poster,
  isIntroVideoPlayed,
  handleIntroPlay,
  setIsButton,
  setIsVideoPlaying,
  updateVideoUrl,
  learnGeeta,
  user,
}) => {
  const handleVideoEnd = () => {
    if (isIntroVideoPlayed) {
      // Check if we're already on the user practice video
      const currentVideoUrl = videoSource?.uri;
      const maleUserPath = get(learnGeeta, 'data.media.hls_male_user');
      const femaleUserPath = get(learnGeeta, 'data.media.hls_female_user');
      
      // If we're already on user practice video, don't switch again
      const isAlreadyOnUserVideo = 
        currentVideoUrl === maleUserPath || 
        currentVideoUrl === femaleUserPath;
      
      if (isAlreadyOnUserVideo) {
        console.log('User practice video ended, not loading another video');
        // Just keep the buttons visible, don't trigger loading
        setIsButton(true);
        setIsVideoPlaying(false);
        videoRef.current?.pause();
        return;
      }

      // Only switch to user video if we're on the main video
      console.log('Main video ended, switching to user practice video');
      setIsButton(true);
      setIsVideoPlaying(true);

      // Manually trigger loading state before changing video URL
      onLoadStart();

      // Small delay to ensure loading state is set before URL changes
      setTimeout(() => {
        if (get(user, 'gender') !== 'female') {
          if (maleUserPath) {
            updateVideoUrl(maleUserPath);
          }
          videoRef.current?.pause();
        } else {
          const fallbackPath = maleUserPath;

          if (femaleUserPath || fallbackPath) {
            updateVideoUrl(femaleUserPath || fallbackPath);
          }
          videoRef.current?.pause();
        }
      }, 100);
    } else {
      handleIntroPlay();
    }
  };

  // Don't render video if source is invalid
  if (!videoSource || !videoSource.uri) {
    return <View style={styles.videoWrapper} />;
  }

  // Safe video source with required properties
  const safeVideoSource = {
    uri: videoSource.uri || '',
    type: videoSource.type || 'm3u8',
    headers: videoSource.headers || {
      'User-Agent': 'Mozilla/5.0',
    },
  };

  // Safe paused state
  let pausedState = true;
  try {
    pausedState = isVideoPaused ? isVideoPaused() : true;
  } catch {
    pausedState = true;
  }

  return (
    <View style={styles.videoWrapper}>
      <Video
        source={safeVideoSource}
        ref={videoRef}
        style={styles.backgroundVideo}
        resizeMode="cover"
        paused={pausedState}
        volume={1.0}
        audioFocus={false}
        ignoreSilentSwitch="ignore"
        // mixWithOthers={true}
        playInBackground={false}
        playWhenInactive={false}
        setFullScreen={true}
        onError={onError}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onEnd={handleVideoEnd}
        bufferConfig={VIDEO_BUFFER_CONFIG}
        controls={false}
        progressUpdateInterval={VIDEO_PROGRESS_UPDATE_INTERVAL}
        repeat={false}
        poster={poster}
        posterResizeMode="cover"
      />
    </View>
  );
};

VideoPlayer.propTypes = {
  videoRef: PropTypes.object,
  videoSource: PropTypes.object,
  isVideoPaused: PropTypes.func,
  onError: PropTypes.func,
  onLoadStart: PropTypes.func,
  onLoad: PropTypes.func,
  onEnd: PropTypes.func,
  poster: PropTypes.string,
  isIntroVideoPlayed: PropTypes.bool,
  handleIntroPlay: PropTypes.func,
  setIsButton: PropTypes.func,
  setIsVideoPlaying: PropTypes.func,
  updateVideoUrl: PropTypes.func,
  learnGeeta: PropTypes.object,
  user: PropTypes.object,
};

export default VideoPlayer;
