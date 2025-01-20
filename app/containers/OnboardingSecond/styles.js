import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageDimensions: {
    height: '100%',
    width: '100%',
  },
  detailContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: wp(16),
  },
  headingText: {
    fontFamily: FONTS.BOLD,
    fontWeight: '700',
    fontSize: hp(24),
    color: COLORS.white,
    lineHeight: hp(36),
  },
  descriptionText: {
    fontWeight: '500',
    fontSize: hp(18),
    color: COLORS.white,
    marginTop: hp(5),
    lineHeight: hp(28),
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: hp(15),
    color: COLORS.firefly,
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    width: 'auto',
    marginTop: hp(20),
    height: hp(45),
  },
});

export default styles;
