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
  },
  headingText: {
    fontFamily: FONTS.BOLD,
    fontSize: hp(24),
    color: COLORS.white,
  },
  descriptionText: {
    fontFamily: FONTS.MEDIUM,
    fontSize: hp(18),
    color: COLORS.white,
    marginTop: hp(5),
  },
  buttonLabel: {
    fontFamily: FONTS.SEMIBOLD,
    fontSize: hp(15),
    color: COLORS.firefly,
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
  },
});

export default styles;
