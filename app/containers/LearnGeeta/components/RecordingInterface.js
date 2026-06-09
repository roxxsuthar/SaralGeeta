import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Lottie from 'lottie-react-native';
import { IMAGES, FONTS } from '../../../constants';
import CustomText from '../../../components/CustomText';
import styles from '../styles';
import { COLOR_ARRAY } from '../../../constants/constants';
import { hp, wp } from '../../../utils/responsive';
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
  onContinuePress,
  onShowPress,
}) => {
  const insets = useSafeAreaInsets();

  const handleStartRecording = () => {
    startRecording(videoRef, setIsVideoPlaying);
  };

  const handleStopRecording = () => {
    stopRecording(videoRef, setIsVideoPlaying);
  };

  // ── Render Speaker Decoration ──
  const renderSpeakerTag = () => {
    if (!learnGeeta?.data?.commentary?.name_sanskrit) return null;
    return (
      <View style={styles.speakerRow}>
        <View style={styles.speakerDeco}>
          <View style={styles.decoDiamond} />
          <View style={styles.decoLine} />
          <View style={styles.decoDiamond} />
        </View>
        <View style={styles.speakerPill}>
          <CustomText style={styles.speakerText}>
            {learnGeeta.data.commentary.name_sanskrit}
          </CustomText>
        </View>
        <View style={styles.speakerDeco}>
          <View style={styles.decoDiamond} />
          <View style={styles.decoLine} />
          <View style={styles.decoDiamond} />
        </View>
      </View>
    );
  };

  // ── Render Shlok Lines ──
  const renderShlokLines = () => {
    const parts = learnGeeta?.data?.shloke_parts;
    if (!parts?.length) return null;
    const chapterNum = `${learnGeeta?.data?.chapter?.serial || ''}.${learnGeeta?.data?.name || ''} ॥`;
    return (
      <>
        {parts.length > 0 && (
          <View style={styles.shlokPill}>
            <CustomText style={styles.shlokText}>
              {parts.map((item, idx) => {
                if (idx < 2) {
                  const isLast = idx === parts.length - 1;
                  return (
                    <CustomText key={idx} style={{ color: COLOR_ARRAY[idx] || '#000' }}>
                      {item}{idx === 0 ? ' ' : (isLast ? ' ॥' : ' ।')}
                    </CustomText>
                  );
                }
                return null;
              })}
              {parts.length <= 2 && (
                <CustomText style={{ color: '#F06225', fontSize: hp(16), fontFamily: FONTS.HINDI, fontWeight: '700' }}>
                  {' '}{chapterNum}
                </CustomText>
              )}
            </CustomText>
          </View>
        )}
        {parts.length > 2 && (
          <View style={styles.shlokPill}>
            <CustomText style={styles.shlokText}>
              {parts.map((item, idx) => {
                if (idx >= 2) {
                  const isLast = idx === parts.length - 1;
                  return (
                    <CustomText key={idx} style={{ color: COLOR_ARRAY[idx] || '#000' }}>
                      {item}{idx === 2 ? ' ' : (isLast ? ' ॥' : ' ।')}
                    </CustomText>
                  );
                }
                return null;
              })}
              <CustomText style={{ color: '#F06225', fontSize: hp(16), fontFamily: FONTS.HINDI, fontWeight: '700' }}>
                {' '}{chapterNum}
              </CustomText>
            </CustomText>
          </View>
        )}
      </>
    );
  };


  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">

      {/* ═══ TOP NAV: Previous / Next ═══ */}
      {isButton && !waitingForTranslation && (
        <View style={[styles.topNav, { paddingTop: hp(15), paddingRight: insets.right > 0 ? insets.right + wp(10) : wp(25) }]}>
          {shlokIndex > 0 ? (
            <TouchableOpacity style={styles.navBtnWrap} onPress={getPreviousShlok} activeOpacity={0.8}>
              <View style={styles.navBtn}>
                <IMAGES.WhiteLeftArrowIcon height={hp(22)} width={wp(22)} fill="#333" />
              </View>
              <CustomText style={styles.navLabel}>Previous</CustomText>
            </TouchableOpacity>
          ) : <View style={{ width: wp(55) }} />}

          {shlokIndex + 1 < (shloks?.data?.length || 0) ? (
            <TouchableOpacity style={styles.navBtnWrap} onPress={getNextShlok} activeOpacity={0.8}>
              <View style={styles.navBtn}>
                <IMAGES.WhiteRightArrowIcon height={hp(22)} width={wp(22)} fill="#333" />
              </View>
              <CustomText style={styles.navLabel}>Next</CustomText>
            </TouchableOpacity>
          ) : <View style={{ width: wp(55) }} />}
        </View>
      )}

      {/* ═══ CENTER: Shlok Text ═══ */}
      <View style={styles.centerContent} pointerEvents="none">
        {renderSpeakerTag()}
        {renderShlokLines()}



        {/* Result (after recording) */}
        {(transcription || waitingForTranslation) && (
          <View style={styles.resultPill}>
            <CustomText style={styles.resultText}>
              {waitingForTranslation ? 'Result: ...' : `Result: ${transcription}`}
            </CustomText>
          </View>
        )}
      </View>

      {/* ═══ BOTTOM: Control Bar ═══ */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(hp(12), insets.bottom), paddingRight: insets.right > 0 ? insets.right + 12 : 0 }]}>
        {/* Left: Mic + Waveform */}
        {isButton && !waitingForTranslation ? (
          <View style={styles.bottomLeft}>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.micOuter}
                onPress={isRecordingButton ? handleStopRecording : handleStartRecording}
                activeOpacity={0.8}
              >
                <View style={styles.micInner}>
                  {isRecordingButton ? (
                    <IMAGES.PauseIcon height={hp(22)} width={wp(22)} />
                  ) : (
                    <IMAGES.MicIcon height={hp(24)} width={wp(24)} />
                  )}
                </View>
              </TouchableOpacity>
              {!isRecordingButton && (
                <CustomText style={[styles.tapText, { marginLeft: 0, marginTop: hp(4) }]}>Tap to start</CustomText>
              )}
            </View>

            {isRecordingButton ? (
              <Lottie
                source={IMAGES.PlayerLottie}
                autoPlay
                loop
                style={styles.lottieAnim}
              />
            ) : (
              <View style={styles.waveArea}>
                <IMAGES.OrangeWaveform width={wp(90)} height={hp(22)} />
              </View>
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {/* Right: Replay + Show + Continue */}
        <View style={styles.bottomRight}>
          <View style={styles.actionColumn}>
            {/* Replay */}
            {isButton && !waitingForTranslation && (
              <TouchableOpacity style={[styles.replayWrap, { marginRight: 0, marginBottom: hp(6) }]} onPress={playAgain} activeOpacity={0.8}>
                <View style={styles.replayCircle}>
                  <IMAGES.ReplayButton height={hp(18)} width={wp(18)} fill="black" />
                </View>
                <CustomText style={styles.replayLabel}>Replay</CustomText>
              </TouchableOpacity>
            )}

            {/* Show */}
            {onShowPress && (
              <TouchableOpacity style={styles.actionPill} onPress={onShowPress} activeOpacity={0.8}>
                <IMAGES.InfoWhiteIcon height={hp(15)} width={wp(15)} />
                <CustomText style={styles.actionPillText}>Show</CustomText>
              </TouchableOpacity>
            )}
            {/* Continue */}
            {onContinuePress && (
              <TouchableOpacity style={[styles.actionPill, { marginTop: hp(6) }]} onPress={onContinuePress} activeOpacity={0.8}>
                <CustomText style={[styles.actionPillText, { marginLeft: 0 }]}>Continue</CustomText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
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
  onContinuePress: PropTypes.func,
  onShowPress: PropTypes.func,
};

export default RecordingInterface;
