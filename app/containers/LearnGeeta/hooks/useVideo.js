import { useState, useCallback, useEffect } from 'react';
import { get } from 'lodash';

export const useVideo = (learnGeeta, introVideo, isIntroVideoPlayed) => {
  const [videoUrl, setVideoUrl] = useState(
    get(learnGeeta, 'data.media.hls_male_path') || null,
  );
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateVideoUrl = (newUrl) => {
    setVideoUrl(newUrl);
  };

  const setVideoReady = (ready) => {
    setIsVideoReady(ready);
  };

  const setVideoLoading = (loading) => {
    setIsLoading(loading);
  };

  const setVideoPlayingState = (playing) => {
    setIsVideoPlaying(playing);
  };

  const resetVideoState = () => {
    setIsVideoReady(false);
    setIsVideoPlaying(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isIntroVideoPlayed) {
      const newVideoUrl = get(learnGeeta, 'data.media.hls_male_path');
      if (newVideoUrl) {
        setVideoUrl(newVideoUrl);
      } else {
        setVideoUrl(null);
      }
    }
  }, [isIntroVideoPlayed, learnGeeta]);

  const getVideoSource = useCallback(() => {
    if (!isIntroVideoPlayed) {
      const introUri = introVideo?.hls_male_path;
      if (!introUri) {
        return null;
      }
      return {
        uri: introUri,
        type: 'm3u8',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      };
    }

    if (!videoUrl) {
      return null;
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
