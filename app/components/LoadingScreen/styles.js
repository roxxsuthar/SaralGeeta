import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { COLORS } from '../../constants';

const defaultStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.loadingTransparent,
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: hp(0.74),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(3),
    paddingHorizontal: wp(7),
  },
  loadingText: {
    marginTop: hp(1),
    color: COLORS.codGray,
    fontSize: hp(2),
  },
});

export default defaultStyles;
