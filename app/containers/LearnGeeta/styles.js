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
    width: '100%',
    height: '100%',
  },
  cloud: {
    width: 150,
    height: 100,
    opacity: 0.8, // Slight transparency
  },
  shlokBackground: {
    height: hp(150),
    width: wp(320),
    position: 'absolute',
    bottom: hp(5),
    left: wp(313),
  },
  shlokText: {
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    color: COLORS.black,
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    position: 'absolute',
    bottom: hp(55),
    left: wp(365.43),
  },
  buttonContainerStyles: {
    position: 'absolute',
    left: 310,
    top: 335,
  },
  buttonStyle: {
    borderRadius: hp(50),
    height: hp(70),
    width: wp(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconStyle: {
    height: hp(40),
    width: wp(40),
  },
  container3: {
    flex: 1,
    position: 'absolute',
    left: 290,
    top: 365,
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  translationText: {
    position: 'absolute',
    bottom: hp(110),
    left: wp(150),
    color: COLORS.black,
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    fontFamily: FONTS.HINDI,
    fontWeight: '600',
  },
});

export default styles;
