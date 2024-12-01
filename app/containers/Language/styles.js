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
    marginTop: hp(92),
  },
  hindiHeadingFont: {
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    fontSize: hp(24),
    lineHeight: hp(36),
    color: COLORS.codGray,
  },
  englishHeadingFont: {
    fontFamily: FONTS.REGULAR,
    fontWeight: '700',
    fontSize: hp(30),
    lineHeight: hp(42),
    color: COLORS.black,
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
  },
  languageSelectContainer: {
    marginTop: hp(40),
  },
  language: {
    borderWidth: hp(1),
    borderColor: COLORS.codGray,
    borderRadius: hp(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
    alignItems: 'center',
  },
  hindiButtonFont: {
    fontFamily: FONTS.HINDI,
    fontWeight: '500',
    fontSize: hp(20),
    lineHeight: hp(30),
    color: COLORS.black,
  },
  hindiButtonFontSmall: {
    fontFamily: FONTS.HINDI,
    fontWeight: '400',
    fontSize: hp(14),
    lineHeight: hp(24),
    color: COLORS.codGray,
    marginTop: hp(2),
  },
  englishButtonFont: {
    fontFamily: FONTS.REGULAR,
    fontWeight: '500',
    fontSize: hp(20),
    lineHeight: hp(30),
    color: COLORS.black,
  },
  englishButtonFontSmall: {
    fontFamily: FONTS.REGULAR,
    fontWeight: '400',
    fontSize: hp(14),
    lineHeight: hp(24),
    color: COLORS.codGray,
    marginTop: hp(2),
  },
  radioButton: {
    height: hp(24),
    width: hp(24),
  },
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
