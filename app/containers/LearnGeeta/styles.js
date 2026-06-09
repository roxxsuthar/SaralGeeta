import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS } from '../../constants';

const styles = StyleSheet.create({
  // ═══════════════════════════════════════
  // Container & Video (used by index.js)
  // ═══════════════════════════════════════
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
  videoWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },

  // ═══════════════════════════════════════
  // Top Navigation (Previous / Next)
  // ═══════════════════════════════════════
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(25),
    zIndex: 10,
  },
  navBtnWrap: {
    alignItems: 'center',
  },
  navBtn: {
    width: hp(50),
    height: hp(50),
    borderRadius: hp(25),
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navLabel: {
    color: 'white',
    fontSize: hp(12),
    fontFamily: FONTS.REGULAR,
    marginTop: hp(4),
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ═══════════════════════════════════════
  // Center Content (Shlok Text Area)
  // ═══════════════════════════════════════
  centerContent: {
    position: 'absolute',
    bottom: hp(15),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },

  // Speaker Tag with Golden Decorations
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(12),
  },
  speakerDeco: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decoLine: {
    width: wp(40),
    height: 0,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#F1A624',
  },
  decoDiamond: {
    width: hp(5),
    height: hp(5),
    backgroundColor: '#F1A624',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: wp(2),
  },
  speakerPill: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderWidth: 1.5,
    borderColor: '#F1A624',
    borderRadius: hp(18),
    paddingHorizontal: wp(18),
    paddingVertical: hp(5),
    marginHorizontal: wp(6),
  },
  speakerText: {
    fontSize: hp(16),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    color: '#F1A624',
    textAlign: 'center',
  },

  // Shlok Text Pills
  shlokPill: {
    backgroundColor: 'white',
    paddingHorizontal: wp(16),
    paddingVertical: hp(6),
    borderRadius: hp(8),
    marginBottom: hp(6),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  shlokText: {
    fontSize: hp(20),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
  },

  // Chapter Number Pill
  chapterPill: {
    backgroundColor: 'white',
    paddingHorizontal: wp(14),
    paddingVertical: hp(3),
    borderRadius: hp(8),
    marginTop: hp(4),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  chapterText: {
    fontSize: hp(16),
    fontFamily: FONTS.HINDI,
    fontWeight: '700',
    color: '#F06225',
  },

  // Result Pill
  resultPill: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderWidth: 1.5,
    borderColor: '#F1A624',
    borderRadius: hp(12),
    paddingHorizontal: wp(20),
    paddingVertical: hp(8),
    marginTop: hp(12),
    alignSelf: 'center',
  },
  resultText: {
    fontSize: hp(18),
    fontFamily: FONTS.REGULAR,
    fontWeight: '700',
    color: 'white',
  },

  // ═══════════════════════════════════════
  // Bottom Control Bar
  // ═══════════════════════════════════════
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: wp(20),
    zIndex: 10,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  replayColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(12),
  },

  actionColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  // Mic Button (nested circles)
  micOuter: {
    width: hp(58),
    height: hp(58),
    borderRadius: hp(29),
    borderWidth: 2,
    borderColor: '#F1A624',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micInner: {
    width: hp(46),
    height: hp(46),
    borderRadius: hp(23),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Waveform + Tap to Start
  waveArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(10),
  },
  tapText: {
    color: 'white',
    fontSize: hp(12),
    fontFamily: FONTS.REGULAR,
    marginLeft: wp(8),
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lottieAnim: {
    width: wp(80),
    height: hp(40),
    marginLeft: wp(8),
  },

  // Replay Button
  replayWrap: {
    alignItems: 'center',
    marginRight: wp(12),
  },
  replayCircle: {
    width: hp(44),
    height: hp(44),
    borderRadius: hp(22),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replayLabel: {
    color: 'white',
    fontSize: hp(10),
    fontFamily: FONTS.REGULAR,
    marginTop: hp(3),
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Action Pill Buttons (Show / Continue)
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: hp(20),
    paddingHorizontal: wp(16),
    paddingVertical: hp(8),
    marginLeft: wp(10),
  },
  actionPillText: {
    color: 'white',
    fontSize: hp(13),
    fontFamily: FONTS.REGULAR,
    fontWeight: '600',
    marginLeft: wp(5),
  },

  // ═══════════════════════════════════════
  // Loading & Animation (used by index.js)
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // Back Button Bar (used by index.js)
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // Skip Button (used by index.js)
  // ═══════════════════════════════════════
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

  // ═══════════════════════════════════════
  // Translation Drawer (used by TranslationDrawer)
  // ═══════════════════════════════════════
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
    shadowOffset: { width: -2, height: 0 },
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
});

export default styles;
