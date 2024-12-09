import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp(16),
    marginTop: hp(69),
  },
  englishHeadingFont: {
    marginTop: hp(40),
    fontWeight: '600',
    fontSize: hp(24),
    lineHeight: hp(32),
    color: COLORS.ebony,
  },
  subHeading: {
    fontWeight: '400',
    fontSize: hp(16),
    lineHeight: hp(24),
    color: COLORS.codGray,
  },
  buttonLabel: {
    fontSize: hp(15),
    fontWeight: '700',
    color: COLORS.firefly,
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    width: 'auto',
    marginTop: hp(26),
    marginBottom: hp(15),
  },
  chakraStyle: {
    position: 'absolute',
    right: hp(-200),
    top: hp(-200),
    height: hp(450),
    width: hp(470),
  },
  icon: {
    height: hp(20),
    width: hp(20),
  },
  headerContainer: {
    height: hp(50),
    width: hp(50),
    backgroundColor: COLORS.gallary(0.3),
    borderRadius: hp(100),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 30,
  },
  dont: {
    fontWeight: '400',
    fontSize: hp(15),
    lineHeight: hp(21),
    color: COLORS.codGray,
    textAlign: 'center',
  },
  create: {
    fontWeight: '700',
    fontSize: hp(15),
    lineHeight: hp(21),
    color: COLORS.codGray,
    textAlign: 'center',
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelOtp: {
    fontWeight: '400',
    fontSize: hp(16),
    lineHeight: hp(24),
    color: COLORS.codGray,
    marginTop: hp(15),
  },
  box: {
    height: hp(60),
    width: hp(60),
    borderRadius: hp(6),
    borderColor: COLORS.codGray,
    color: COLORS.dark(),
    fontSize: hp(15),
  },
  OtpContainer: {
    height: hp(60),
    width: wp(327),
    marginTop: hp(24),
  },
  resendCode: {
    marginTop: hp(15),
    alignItems: 'flex-end',
  },
  timer: {
    color: COLORS.black,
    fontSize: hp(16),
    fontWeight: '500',
    lineHeight: hp(24),
  },
  timer1: {
    color: COLORS.black,
    fontSize: hp(16),
    fontWeight: '500',
    lineHeight: hp(24),
  },
  resendText: {
    alignContent: 'center',
  },
});

export default styles;
