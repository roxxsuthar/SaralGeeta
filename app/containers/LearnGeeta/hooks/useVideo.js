import { useState, useCallback, useEffect } from 'react';
import { get } from 'lodash';

export const useVideo = (learnGeeta, selectedIdeal, isIntroVideoPlayed) => {
  const [videoUrl, setVideoUrl] = useState(
    get(learnGeeta, 'data.media.hls_male_path') || null,
  );
  const [isVideoReady, setIsVideoReady] = useState(false);
  // isVideoPlaying=true means "the video is in paused/stopped state"
  // (confusing name kept for backward compat — true = paused)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stable references — these must be useCallback so their identity doesn't
  // change on every render (prevents infinite useEffect loops in the parent).
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
      const newVideoUrl = get(learnGeeta, 'data.media.hls_male_path');
      if (newVideoUrl) {
        setVideoUrl(newVideoUrl);
      } else {
        setVideoUrl(null);
      }
    }
  }, [isIntroVideoPlayed, learnGeeta]);

  // Reset ready state whenever the video URL changes to ensure correct sequencing
  useEffect(() => {
    setIsVideoReady(false);
  }, [videoUrl]);

  const getVideoSource = useCallback(() => {
    if (!isIntroVideoPlayed) {
      const introUri = selectedIdeal?.hls_male_path;
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
  }, [isIntroVideoPlayed, selectedIdeal, videoUrl]);

  // isVideoPaused() → true means the <Video> paused prop should be true.
  // isVideoPlaying=true means "we want it paused" (legacy naming).
  const isVideoPaused = useCallback(() => {
    if (isVideoPlaying) {
      return true; // explicitly paused
    }
    return !isVideoReady; // paused while buffering
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
