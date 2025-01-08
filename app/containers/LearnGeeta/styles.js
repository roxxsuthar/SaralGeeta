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
  },
  videoWrapper: {
    width: '100%',
    overflow: 'hidden', // Clip video to fit within border
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    // width: '100%',
    // height: '100%',
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
    borderRadius: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(90),
    zIndex: 999,
  },
  buttonIconStyle: {
    height: hp(40),
    width: wp(40),
  },
  container3: {
    flex: 1,
    marginTop: hp(100),
    marginLeft: wp(310),
    paddingHorizontal: 0,
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
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    fontFamily: FONTS.HINDI,
    fontWeight: '600',
    verticalAlign: 'top',
    left: wp(100),
    top: hp(20),
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
    height: hp(135),
    width: wp(280),
    justifyContent: 'center', // Optional: Centers text vertically inside the image
    alignItems: 'center', // Optional: Centers text horizontally inside the image
  },
  overlayText: {
    position: 'absolute', // Ensures the text is over the image
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    color: COLORS.black,
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    textAlign: 'center',
  },
  animation: {
    width: 'auto', // Adjust the width
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
    left: wp(380),
    top: hp(170),
    flexDirection: 'row',
    zIndex: 90,
  },
  controlButtonStyle: {
    borderRadius: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.semiTransparent,
    padding: hp(3),
    height: hp(40),
    width: hp(40),
  },
  controlButtonStyle1: {
    borderRadius: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.semiTransparent,
    marginHorizontal: wp(15),
    height: hp(40),
    width: hp(40),
  },
  controlIconStyle: {
    height: hp(30),
    width: hp(30),
  },
});

export default styles;
