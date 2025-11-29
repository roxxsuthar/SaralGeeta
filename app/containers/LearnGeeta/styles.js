import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS } from '../../constants';

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  gradientBorder: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  // Video styles
  videoWrapper: {
    width: '100%',
    overflow: 'hidden',
  },

  backgroundVideo: {
    width: '100%',
    height: '100%',
  },

  // Overlay and content styles
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    pointerEvents: 'box-none',
  },

  svgImageContainer1: {
    position: 'absolute',
    height: hp(120),
    width: wp(520),
    bottom: 0,
    alignSelf: 'center',
  },

  // Text styles
  overlayText: {
    position: 'absolute',
    fontSize: hp(24),
    lineHeight: hp(35),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(30),
    width: wp(500),
  },

  translationText: {
    position: 'absolute',
    fontSize: hp(24),
    lineHeight: hp(35),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(40),
    width: wp(500),
  },

  // Button styles
  buttonStyle: {
    position: 'absolute',
    bottom: hp(10),
    borderRadius: hp(40),
    left: 170,
    zIndex: 1000,
  },

  buttonIconStyle: {
    height: hp(28),
    width: wp(28),
  },

  // Control buttons styles
  controlContainer: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: hp(60),
    flexDirection: 'row',
    zIndex: 1000,
    width: wp(550),
    paddingHorizontal: wp(24),
  },

  controlButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(3),
    height: hp(48),
    width: wp(48),
  },

  controlButtonStyle1: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
    marginTop: hp(60),
  },

  controlIconStyle: {
    height: hp(28),
    width: wp(28),
  },

  // Animation styles
  animation: {
    position: 'absolute',
    left: 170,
    width: wp(200),
    height: hp(50),
    bottom: hp(-5),
    zIndex: 999,
  },

  cloudAnimationContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },

  cloudAnimation: {
    height: '100%',
    width: '100%',
  },
});

export default styles;
