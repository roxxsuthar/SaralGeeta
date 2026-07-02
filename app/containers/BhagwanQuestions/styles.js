import { StyleSheet, Dimensions } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { FONTS } from '../../constants';

const { width: W, height: H } = Dimensions.get('window');

const styles = StyleSheet.create({

  /* ─── Root ─────────────────────────────────────────── */
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  /* ─── Full-screen background ────────────────────────── */
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: W,
    height: H,
  },

  /* Dark gradient overlay sitting on the lower half */
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.52,
    backgroundColor: 'transparent',
  },

  /* ─── Content (sits on top of bg + overlay) ─────────── */
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  /* ─── Back button ────────────────────────────────── */
  backBtn: {
    position: 'absolute',
    left: wp(18),
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  /* ─── Cloud shape (ImageBackground) ──────────────────── */
  cloudOuter: {
    width: W * 0.9,
    alignSelf: 'center',
    marginBottom: hp(8),
    zIndex: 5,
  },
  cloudImgBg: {
    width: '100%',
    aspectRatio: 1.383, // merged PNG: 956/691
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cloudImgContent: {
    width: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    // cloudHeight = (W * 0.9) / 1.383
    // ? badge circle occupies top ~35% of cloud height
    // ornamental divider starts at ~80% → text box ends before that
    marginTop: (W * 0.9 / 1.383) * 0.44,
    maxHeight: (W * 0.9 / 1.383) * 0.35,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: hp(14),
    color: '#1a2b5e',
    textAlign: 'center',
    lineHeight: hp(21),
    fontFamily: FONTS.POPPINS_MEDIUM,
    letterSpacing: 0.2,
  },

  /* ─── Bottom dark panel ──────────────────────────────── */
  bottomPanel: {
    backgroundColor: '#102046',
    paddingTop: hp(28),
    paddingHorizontal: wp(22),
    paddingBottom: hp(26),
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  /* Counter pill */
  counter: {
    alignSelf: 'flex-start',
    color: 'rgba(255,255,255,0.45)',
    fontSize: hp(12),
    fontFamily: FONTS.POPPINS_REGULAR,
    marginBottom: hp(10),
  },

  /* Input row */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: 'rgba(201,168,76,0.45)',
    paddingHorizontal: wp(18),
    paddingVertical: hp(12),
    marginBottom: hp(16),
  },
  pencil: {
    fontSize: wp(16),
    marginRight: wp(10),
    color: '#c9a84c',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontSize: hp(15),
    color: '#fff',
    fontFamily: FONTS.POPPINS_REGULAR,
    minHeight: hp(36),
    maxHeight: hp(90),
    textAlignVertical: 'center',
  },

  /* Submit / Next button */
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a3360',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#c9a84c',
    paddingVertical: hp(14),
    paddingHorizontal: wp(50),
    shadowColor: '#c9a84c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
  submitTxt: {
    color: '#fff',
    fontSize: hp(18),
    fontFamily: FONTS.POPPINS_SEMI_BOLD,
    marginRight: wp(10),
  },
  arrowTxt: {
    color: '#fff',
    fontSize: hp(18),
    fontFamily: FONTS.POPPINS_MEDIUM,
  },

  /* Loading */
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Navigation row (Prev + Next/Submit) */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(4),
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 30,
    borderWidth: 1.2,
    borderColor: 'rgba(201,168,76,0.45)',
    paddingVertical: hp(13),
    paddingHorizontal: wp(22),
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnTxt: {
    color: '#fff',
    fontSize: hp(16),
    fontFamily: FONTS.POPPINS_MEDIUM,
  },
});

export default styles;
