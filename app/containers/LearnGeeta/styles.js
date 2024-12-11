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
    top: hp(30),
    left: wp(313),
  },
  shlokText: {
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    color: COLORS.black,
    fontSize: hp(13.48),
    lineHeight: hp(27.93),
    position: 'absolute',
    top: hp(74.25),
    left: wp(365.43),
  },
});

export default styles;
