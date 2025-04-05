import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS, FONTS } from '../../constants';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Ensures the background is black during playback
  },
  gradientBorder: {
    flex: 1,
    overflow: 'hidden', // Ensures video stays within the border
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  videoWrapper: {
    width: '100%',
    overflow: 'hidden', // Clip video to fit within border
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  cloud: {
    width: 150,
    height: 100,
    opacity: 0.8, // Slight transparency
  },

  buttonContainerStyles: {
    position: 'absolute',
    left: 310,
    top: 335,
  },
  buttonStyle: {
    position: 'absolute',
    borderRadius: hp(40),
    marginLeft: wp(65),
    marginTop: hp(95),
    zIndex: 999,
  },
  buttonIconStyle: {
    height: hp(24),
    width: wp(24),
  },
  container3: {
    // position: 'absolute',
    marginTop: hp(95),
    marginLeft: hp(80),
    // zIndex: 1,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  translationText: {
    position: 'absolute',
    color: COLORS.black,
    fontSize: hp(20),
    lineHeight: hp(27.93),
    fontFamily: FONTS.HINDI,
    fontWeight: '600',
    verticalAlign: 'top',
    left: wp(110),
    top: hp(60),
  },
  overlay: {
    position: 'absolute', // Ensures this container overlays the video
    right: wp(150),
    bottom: hp(0),
    flexDirection: 'row',
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  svgImageContainer: {
    position: 'relative', // Allows positioning of child elements relative to this container
    height: hp(150),
    width: wp(320),
  },
  overlayText: {
    position: 'absolute',
    color: COLORS.black,
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    alignSelf: 'center',
    marginTop: hp(40),
  },
  animation: {
    position: 'absolute',
    marginLeft: wp(90),
    marginTop: hp(85),
    width: wp(100), // Adjust the width
    height: hp(50), // Adjust the height
  },
  cloudAnimationContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
  cloudAnimation: {
    height: '100%',
    width: '100%',
  },
  controlContainer: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: hp(170),
    flexDirection: 'row',
    zIndex: 90,
    width: '100%',
    paddingHorizontal: wp(24),
  },
  controlButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(3),
    height: hp(24),
    width: hp(24),
  },
  controlButtonStyle1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(15),
    height: hp(24),
    width: hp(24),
  },
  controlIconStyle: {
    height: hp(24),
    width: hp(24),
  },
});

export default styles;
