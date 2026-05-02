import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
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
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(25),
    paddingHorizontal: wp(35),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  loadingText: {
    marginTop: hp(15),
    color: COLORS.black,
    fontSize: hp(16),
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
  },
});

export default defaultStyles;
