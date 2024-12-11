import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp(16),
    marginTop: hp(100),
    justifyContent: 'space-between',
  },
  englishHeadingFont: {
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
    marginTop: hp(20),
    height: hp(44),
  },
  continueText: {
    fontSize: hp(14),
    fontWeight: '400',
    lineHeight: hp(17),
    color: COLORS.codGray,
  },
  line: {
    width: wp(99.5),
    height: hp(1),
    backgroundColor: COLORS.codGray,
  },
  mainLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialIcon: {
    width: wp(164.5),
    height: hp(45),
    borderRadius: hp(8),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  socialIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(20),
  },
  socialIconBox: {
    height: hp(20),
    width: hp(20),
  },
  facebookText: {
    marginLeft: wp(5),
    fontSize: hp(15),
    fontWeight: '600',
    lineHeight: hp(22),
    color: COLORS.firefly,
  },
  dont: {
    fontWeight: '400',
    fontSize: hp(15),
    lineHeight: hp(21),
    color: COLORS.codGray,
  },
  create: {
    fontWeight: '700',
    fontSize: hp(15),
    lineHeight: hp(21),
    color: COLORS.codGray,
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(40),
  },
  phoneNumberContainer: {
    marginTop: hp(25),
  },
  phoneNumberLabel: {
    fontWeight: '500',
    fontSize: hp(14),
    lineHeight: hp(17),
    color: COLORS.codGray,
  },
  mobileNumberOnBlur: {
    borderRadius: hp(12),
    borderWidth: 1,
    borderColor: COLORS.emoDivider,
    height: hp(44),
    width: wp(343),
    paddingVertical: 0,
    marginTop: hp(8),
  },
  mobileNumberOnFocus: {
    height: hp(44),
    width: wp(343),
    borderRadius: hp(8),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  countryCode: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(12),
  },
  codeTextStyle: {
    fontSize: hp(14),
    fontWeight: '400',
    marginRight: 0,
    fontFamily: FONTS.REGULAR,
  },
  number: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
  },
  numberText: {
    height: hp(17),
    fontSize: hp(14),
    paddingTop: 0,
    paddingRight: wp(4.27),
    paddingLeft: 0,
    color: COLORS.codGray,
    alignItem: 'center',
  },
  closeCrossContainer: {
    height: hp(24),
    width: hp(24),
    borderLeftColor: COLORS.emoDivider,
    borderLeftWidth: wp(1),
  },
  closeCross: {
    height: hp(24),
    width: hp(24),
    marginLeft: wp(6),
  },
  bottomSheetHeading: {
    marginVertical: hp(21),
    alignSelf: 'center',
    fontSize: hp(18),
    color: COLORS.codGray,
  },
  countryTextStyle: {
    fontSize: hp(2.09),
    color: COLORS.emoGrey,
    fontFamily: FONTS.REGULAR,
  },
  closeButtonStyle: {
    width: hp(28.56),
    height: hp(28.56),
    marginLeft: wp(6.4),
    marginTop: hp(1),
  },
  filterStyle: {
    fontSize: hp(2.09),
    color: COLORS.codGray,
    paddingHorizontal: wp(4.27),
    paddingTop: 0,
    paddingBottom: 0,
    width: wp(73.87),
    fontFamily: FONTS.REGULAR,
  },
  flagButton: { marginLeft: wp(0) },
  logo: {
    height: hp(200),
    width: wp(200),
    alignSelf: 'center',
    marginBottom: hp(20),
  },
  chakraStyle: {
    position: 'absolute',
    right: hp(-200),
    top: hp(-200),
    height: hp(450),
    width: hp(470),
  },
});

export default styles;
