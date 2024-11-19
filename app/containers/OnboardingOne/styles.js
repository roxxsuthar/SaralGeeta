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
    fontSize: hp(24),
    color: COLORS.white,
    fontWeight: '700',
    lineHeight: hp(36),
  },
  descriptionText: {
    fontSize: hp(18),
    color: COLORS.white,
    marginTop: hp(5),
    fontWeight: '500',
    lineHeight: hp(28),
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
  },
});

export default styles;
