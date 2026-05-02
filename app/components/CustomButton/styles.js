import { StyleSheet } from 'react-native';
import isEqual from 'lodash/isEqual';
import { COLORS, FONTS } from '../../constants';
import { marginBottom, OS } from '../../utils/device';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  defaultContainer: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.orange,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: marginBottom(24),
  },
  defaultButtonText: {
    fontSize: 18,
    textAlign: 'center',
    alignItems: 'center',
    color: COLORS.white,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700',
  },
  disabledContainerStyle: {
    height: hp(60),
    borderRadius: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.emoGrey,
    borderColor: COLORS.white,
    borderWidth: hp(1),
    marginBottom: marginBottom(24),
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
