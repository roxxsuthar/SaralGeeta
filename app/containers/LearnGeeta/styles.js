import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS, COLORS } from '../../constants';

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  gradientBorder: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  // Video styles
  videoWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  backgroundVideo: {
    width: '100%',
    height: '100%',
  },

  // Overlay and content styles
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    pointerEvents: 'box-none',
  },

  svgImageContainer1: {
    position: 'absolute',
    height: hp(120),
    left: '15%',
    right: '7%',
    bottom: hp(0),
  },

  // Text styles
  overlayText: {
    position: 'absolute',
    fontSize: hp(20),
    lineHeight: hp(30),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(20),
    left: '15%',
    right: '7%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  translationText: {
    position: 'absolute',
    fontSize: hp(24),
    lineHeight: hp(35),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(50),
    left: '15%',
    right: '7%',
    color: '#000000',
  },

  // Button styles
  buttonStyle: {
    position: 'absolute',
    bottom: hp(15),
    borderRadius: hp(40),
    left: '17%',
    marginLeft: wp(15),
    zIndex: 1000,
  },

  buttonIconStyle: {
    height: hp(28),
    width: wp(28),
  },

  // Control buttons styles
  controlContainer: {
    position: 'absolute',
    bottom: hp(0),
    zIndex: 1005,
    left: '15%',
    right: '7%',
    height: hp(130),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
    paddingHorizontal: wp(10),
  },

  topLeftControl: {
    position: 'absolute',
    top: hp(8),
    left: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },

  bottomLeftControl: {
    position: 'absolute',
    bottom: hp(8),
    left: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },

  topRightControl: {
    position: 'absolute',
    top: hp(8),
    right: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },

  bottomRightControl: {
    position: 'absolute',
    bottom: hp(8),
    right: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },

  buttonStyle: {
    borderRadius: hp(40),
    zIndex: 1010,
  },

  controlButtonStyle2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },

  controlIconStyle: {
    height: hp(28),
    width: wp(28),
  },

  // Animation styles
  animation: {
    position: 'absolute',
    left: '15%',
    marginLeft: wp(60),
    width: wp(200),
    height: hp(50),
    bottom: hp(-5),
    zIndex: 999,
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

  cloudAnimation: {
    height: '100%',
    width: '100%',
  },

  // Header Buttons styles
  headerButtonsContainer: {
    position: 'absolute',
    top: hp(20),
    right: wp(35),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1001,
  },
  continueButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: hp(20),
    paddingHorizontal: wp(15),
    paddingVertical: hp(8),
    marginRight: wp(10),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: hp(14),
    fontWeight: '700',
    fontFamily: FONTS.HINDI,
  },
  eyeIconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: hp(20),
    padding: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1002,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: hp(45),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(35),
  },

  backButtonTitle: {
    fontSize: hp(20),
    color: '#FFFFFF',
    fontFamily: FONTS.HINDI,
    marginLeft: wp(15),
    fontWeight: '700',
  },

  // Drawer styles
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  drawerBackdrop: {
    flex: 1,
  },

  drawerContainer: {
    width: wp(300),
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(20),
    paddingVertical: hp(15),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  drawerTitle: {
    fontSize: hp(20),
    fontWeight: '700',
    color: '#000000',
  },

  closeButton: {
    padding: hp(5),
    alignItems: 'flex-end',
  },

  drawerContent: {
    flex: 1,
    paddingHorizontal: wp(20),
    paddingVertical: hp(15),
  },

  translationContent: {
    fontSize: hp(16),
    lineHeight: hp(24),
    color: '#333333',
    marginBottom: hp(30),
  },
  text: {
    fontSize: hp(16),
    lineHeight: hp(24),
    fontWeight: '600',
    color: '#333333',
    marginTop: hp(10),
  },
  shloke: {
    fontSize: hp(16),
    lineHeight: hp(24),
    color: '#333333',
  },
  commentory: {
    fontSize: hp(14),
    lineHeight: hp(24),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  chapterName: {
    fontSize: hp(16),
    lineHeight: hp(24),
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },

  // Skip button styles
  skipButton: {
    position: 'absolute',
    top: hp(20),
    right: wp(20),
    zIndex: 1001,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: hp(8),
    paddingHorizontal: wp(20),
    paddingVertical: hp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  skipButtonText: {
    fontSize: hp(16),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default styles;
