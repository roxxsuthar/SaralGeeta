import { StyleSheet } from 'react-native';
import isEqual from 'lodash/isEqual';
import { COLORS, FONTS } from '../../constants';
import { marginBottom, OS } from '../../utils/device';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  defaultContainer: {
    height: hp(60),
    borderRadius: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark(),
    borderColor: COLORS.white,
    borderWidth: hp(1),
    marginBottom: marginBottom(24),
  },
  defaultButtonText: {
    fontSize: hp(17),
    textAlign: 'center',
    alignItems: 'center',
    color: COLORS.white,
    fontFamily: FONTS.REGULAR,
  },
  disabledContainerStyle: {
    height: hp(60),
    borderRadius: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.emoGrey,
    borderColor: COLORS.white,
    borderWidth: hp(1),
  },
  disabledButtonText: {
    fontSize: hp(17),
    alignItems: 'center',
    textAlign: 'center',
    color: COLORS.white,
    fontFamily: FONTS.REGULAR,
  },
  textIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousNavigateIcon: {
    width: hp(8.4),
    height: hp(13),
    marginRight: wp(8.05),
    marginBottom: isEqual(OS, 'android') ? hp(3.5) : 0,
  },
  nextNavigateIcon: {
    width: hp(8.4),
    height: hp(13),
    marginLeft: wp(8.05),
    marginBottom: isEqual(OS, 'android') ? hp(3.5) : 0,
  },
});

export default styles;
