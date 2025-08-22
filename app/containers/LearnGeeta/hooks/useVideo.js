import { useState, useCallback, useEffect } from 'react';
import { get } from 'lodash';

export const useVideo = (learnGeeta, introVideo, isIntroVideoPlayed) => {
  const [videoUrl, setVideoUrl] = useState(
    learnGeeta?.data?.media?.hls_male_path,
  );
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateVideoUrl = useCallback((newUrl) => {
    setVideoUrl(newUrl);
  }, []);

  const setVideoReady = useCallback((ready) => {
    setIsVideoReady(ready);
  }, []);

  const setVideoLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  const setVideoPlayingState = useCallback((playing) => {
    setIsVideoPlaying(playing);
  }, []);

  const resetVideoState = useCallback(() => {
    setIsVideoReady(false);
    setIsVideoPlaying(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isIntroVideoPlayed) {
      setVideoUrl(get(learnGeeta, 'data.media.hls_male_path'));
    }
  }, [isIntroVideoPlayed, learnGeeta]);

  const getVideoSource = useCallback(() => {
    if (!isIntroVideoPlayed) {
      return {
        uri: introVideo?.hls_male_path,
        type: 'm3u8',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      };
    }

    return {
      uri: videoUrl,
      type: 'm3u8',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    };
  }, [isIntroVideoPlayed, introVideo, videoUrl]);

  const isVideoPaused = useCallback(() => {
    if (isVideoPlaying) {
      return isVideoPlaying;
    } else {
      return !isVideoReady;
    }
  }, [isVideoPlaying, isVideoReady]);

  return {
    videoUrl,
    isVideoReady,
    isVideoPlaying,
    isLoading,
    updateVideoUrl,
    setVideoReady,
    setVideoLoading,
    setVideoPlayingState,
    resetVideoState,
    getVideoSource,
    isVideoPaused,
  };
};
