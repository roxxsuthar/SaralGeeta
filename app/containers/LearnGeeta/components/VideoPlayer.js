import logger from '../../../utils/logger';
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
  onPlaybackStateChanged,
  onPlaybackResume,
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
    logger.log('video ended');
    if (isIntroVideoPlayed) {
      setIsButton(true);
      setIsVideoPlaying(true);

      if (get(user, 'gender') === 'male') {
        updateVideoUrl(get(learnGeeta, 'data.media.hls_male_user'));
        videoRef.current?.pause();
      } else {
        const femalePath = get(learnGeeta, 'data.media.hls_female_user');
        updateVideoUrl(
          femalePath || get(learnGeeta, 'data.media.hls_male_user'),
        );
        videoRef.current?.pause();
      }
    } else {
      handleIntroPlay();
    }
  };

  return (
    <View style={styles.videoWrapper}>
      <Video
        source={videoSource}
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
        onError={onError}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onEnd={handleVideoEnd}
        onPlaybackStateChanged={onPlaybackStateChanged}
        onPlaybackResume={onPlaybackResume}
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
  onPlaybackStateChanged: PropTypes.func,
  onPlaybackResume: PropTypes.func,
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
