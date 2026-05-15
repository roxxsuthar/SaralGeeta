import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS, COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  gradientBorder: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1002,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: '15%',
    right: '15%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  svgImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  shlokTextContainer: {
    zIndex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shlokText: {
    textAlign: 'center',
    color: '#000000',
  },
  bottomControlsContainer: {
    position: 'absolute',
    right: 20,
    top: '20%',
    bottom: '20%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1005,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 35,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  controlButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 25,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  speedButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
  cloudAnimationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  chakraImage: {
    width: hp(150),
    height: hp(150),
  },
});

export default styles;
