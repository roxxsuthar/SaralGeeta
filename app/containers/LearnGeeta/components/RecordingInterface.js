import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import FastImage from 'react-native-fast-image';
import { IMAGES, FONTS } from '../../../constants';
import CustomText from '../../../components/CustomText';
import styles from '../styles';
import { COLOR_ARRAY } from '../../../constants/constants';
import { hp } from '../../../utils/responsive';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RecordingInterface = ({
  transcription,
  learnGeeta,
  isButton,
  isRecordingButton,
  startRecording,
  stopRecording,
  videoRef,
  setIsVideoPlaying,
  waitingForTranslation,
  shlokIndex,
  shloks,
  getPreviousShlok,
  playAgain,
  getNextShlok,
}) => {
  const insets = useSafeAreaInsets();

  const handleStartRecording = () => {
    startRecording(videoRef, setIsVideoPlaying);
  };

  const handleStopRecording = () => {
    stopRecording(videoRef, setIsVideoPlaying);
  };

  return (
    <View style={[styles.overlay, { bottom: insets.bottom }]}>
      {/* Background image placed at the bottom */}
      <FastImage
        style={styles.svgImageContainer1}
        source={IMAGES.ShlokBackground}
        resizeMode={FastImage.resizeMode.stretch}
      />

      {/* Now overlay the shloke parts text or transcription */}
      {transcription || waitingForTranslation ? (
        <CustomText style={styles.translationText}>
          {waitingForTranslation ? 'Result: ...' : 'Result:'} {transcription}
        </CustomText>
      ) : (
        !waitingForTranslation && (
          <View style={styles.overlayText}>
            <CustomText style={{ textAlign: 'center', lineHeight: hp(35) }}>
              {learnGeeta?.data?.shloke_parts?.map((item, idx) => (
                <React.Fragment key={idx}>
                  <CustomText
                    style={{
                      fontSize: hp(22),
                      fontFamily: FONTS.HINDI,
                      fontWeight: '700',
                      color: COLOR_ARRAY[idx],
                    }}
                  >
                    {item}
                    {idx === 3 && ` || ${learnGeeta?.data?.chapter?.serial || ''}.${learnGeeta?.data?.name || ''} ||`}
                  </CustomText>
                  {idx < 3 && (idx === 1 ? '\n' : ' ')}
                </React.Fragment>
              ))}
            </CustomText>
          </View>
        )
      )}

      {/* Buttons and animation on top */}
      {isButton && !waitingForTranslation && (
        <View style={styles.controlContainer}>
          {/* Left side container for left arrow and mic button */}
          <View style={styles.leftControlGroup}>
            {/* Left arrow */}
            {shlokIndex > 0 && (
              <TouchableOpacity
                style={styles.controlButtonStyle}
                onPress={getPreviousShlok}
                activeOpacity={0.8}
              >
                <View style={styles.controlIconStyle}>
                  <IMAGES.WhiteLeftArrowIcon height="100%" width="100%" />
                </View>
              </TouchableOpacity>
            )}

            {/* Mic/Pause button */}
            {isRecordingButton ? (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleStopRecording}
                activeOpacity={0.8}
              >
                <View style={styles.buttonIconStyle}>
                  <IMAGES.PauseIcon height="100%" width="100%" />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleStartRecording}
                activeOpacity={0.8}
              >
                <View style={styles.buttonIconStyle}>
                  <IMAGES.MicIcon height="100%" width="100%" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Right side container for right arrow and replay button */}
          <View style={styles.rightControlGroup}>
            {/* Right arrow */}
            {shlokIndex + 1 < (shloks?.data?.length || 0) && (
              <TouchableOpacity
                style={styles.controlButtonStyle2}
                onPress={playAgain}
                activeOpacity={0.8}
              >
                <View style={styles.controlIconStyle}>
                  <IMAGES.ReplayButton height="100%" width="100%" />
                </View>
              </TouchableOpacity>
            )}

            {/* Replay button */}
            <TouchableOpacity
              style={styles.controlButtonStyle1}

              onPress={getNextShlok}
              activeOpacity={0.8}
            >

              <View style={styles.controlIconStyle}>
                <IMAGES.WhiteRightArrowIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          </View>

          {isRecordingButton && (
            <Lottie
              source={IMAGES.PlayerLottie}
              autoPlay
              loop
              style={[styles.animation, { position: 'absolute', left: '0%', bottom: -2 }]}
            />
          )}
        </View>
      )}
    </View>
  );
};

RecordingInterface.propTypes = {
  transcription: PropTypes.string,
  learnGeeta: PropTypes.object,
  isButton: PropTypes.bool,
  isRecordingButton: PropTypes.bool,
  startRecording: PropTypes.func,
  stopRecording: PropTypes.func,
  videoRef: PropTypes.object,
  setIsVideoPlaying: PropTypes.func,
  waitingForTranslation: PropTypes.bool,
  shlokIndex: PropTypes.number,
  shloks: PropTypes.object,
  getPreviousShlok: PropTypes.func,
  playAgain: PropTypes.func,
  getNextShlok: PropTypes.func,
};

export default RecordingInterface;
