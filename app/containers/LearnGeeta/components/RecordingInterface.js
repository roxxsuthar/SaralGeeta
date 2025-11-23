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
}) => {
  const handleStartRecording = () => {
    startRecording(videoRef, setIsVideoPlaying);
  };

  const handleStopRecording = () => {
    stopRecording(videoRef, setIsVideoPlaying);
  };

  return (
    <View style={styles.overlay}>
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
                      fontSize: hp(24),
                      fontFamily: FONTS.HINDI,
                      fontWeight: '700',
                      color: COLOR_ARRAY[idx],
                      ...(!isButton ? { bottom: hp(35) } : {}),
                    }}
                  >
                    {item}
                  </CustomText>
                  {idx === 1 && '\n'}
                </React.Fragment>
              ))}
            </CustomText>
          </View>
        )
      )}

      {/* Buttons and animation on top */}
      {isButton && !waitingForTranslation && (
        <>
          {!isRecordingButton ? (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleStartRecording}
              activeOpacity={0.8}
            >
              <View style={styles.buttonIconStyle}>
                <IMAGES.MicIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleStopRecording}
              activeOpacity={0.8}
            >
              <View style={styles.buttonIconStyle}>
                <IMAGES.PauseIcon height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          )}

          {isRecordingButton && (
            <Lottie
              source={IMAGES.PlayerLottie}
              autoPlay
              loop
              style={styles.animation}
            />
          )}
        </>
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
  audio: PropTypes.object,
  videoRef: PropTypes.object,
  setIsVideoPlaying: PropTypes.func,
  waitingForTranslation: PropTypes.bool,
};

export default RecordingInterface;
