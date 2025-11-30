import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS } from '../../constants';

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
    width: wp(520),
    bottom: 0,
    alignSelf: 'center',
  },

  // Text styles
  overlayText: {
    position: 'absolute',
    fontSize: hp(24),
    lineHeight: hp(35),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(30),
    width: wp(500),
  },

  translationText: {
    position: 'absolute',
    fontSize: hp(24),
    lineHeight: hp(35),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    zIndex: 1,
    textAlign: 'center',
    bottom: hp(40),
    width: wp(500),
  },

  // Button styles
  buttonStyle: {
    position: 'absolute',
    bottom: hp(10),
    borderRadius: hp(40),
    left: 170,
    zIndex: 1000,
  },

  buttonIconStyle: {
    height: hp(28),
    width: wp(28),
  },

  // Control buttons styles
  controlContainer: {
    position: 'absolute',
    bottom: hp(60),
    zIndex: 1000,
    width: wp(550),
    height: hp(120),
    paddingHorizontal: wp(24),
  },

  controlButtonStyle: {
    position: 'absolute',
    left: wp(24),
    top: hp(70),
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(3),
    height: hp(48),
    width: wp(48),
  },

  controlButtonStyle1: {
    position: 'absolute',
    right: 0,
    top: hp(60),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(48),
    width: wp(48),
  },
  fixRightButton: {
    position: 'absolute',
    right: wp(24),
    top: hp(70),
    bottom: 0,
  },
  controlButtonStyle2: {
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(3),
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
    left: 170,
    width: wp(200),
    height: hp(50),
    bottom: hp(-5),
    zIndex: 999,
  },

  cloudAnimationContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },

  cloudAnimation: {
    height: '100%',
    width: '100%',
  },

  // Eye Icon styles
  eyeIconButton: {
    position: 'absolute',
    top: hp(20),
    right: wp(20),
    zIndex: 1001,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: hp(20),
    padding: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default styles;
