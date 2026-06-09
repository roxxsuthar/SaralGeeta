import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS } from '../../constants';

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

  // ═══════════════════════════════════════
  // Floating Back Button
  // ═══════════════════════════════════════
  headerButtonsContainer: {
    position: 'absolute',
    zIndex: 1002,
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
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
  actionColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
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

  // Specific buttons for FullChapterLearn styled like the circle buttons
  actionCircle: {
    width: hp(44),
    height: hp(44),
    borderRadius: hp(22),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCircleLabel: {
    color: 'white',
    fontSize: hp(10),
    fontFamily: FONTS.REGULAR,
    marginTop: hp(3),
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionWrap: {
    alignItems: 'center',
    marginRight: wp(12),
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
    backgroundColor: 'white',
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
    color: 'black',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Outfit-Bold',
  },
});

export default styles;
