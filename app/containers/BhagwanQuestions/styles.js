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

  /* Dark gradient overlay — taller now that cloud is removed */
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: H * 0.45,
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

  /* ─── Question text inside bottom panel ─────────────── */
  questionTextPanel: {
    width: '100%',
    fontSize: hp(15),
    color: '#ffffff',
    fontFamily: FONTS.SEMIBOLD,
    lineHeight: hp(22),
    marginBottom: hp(10),
  },
  questionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(201,168,76,0.4)',
    marginBottom: hp(12),
  },

  /* ─── Bottom dark panel ──────────────────────────────── */
  bottomPanel: {
    backgroundColor: '#0d1b3e',
    paddingTop: hp(20),
    paddingHorizontal: wp(22),
    paddingBottom: hp(26),
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },

  /* Counter */
  counter: {
    alignSelf: 'flex-start',
    color: 'rgba(255,255,255,0.5)',
    fontSize: hp(12),
    fontFamily: FONTS.REGULAR,
    marginBottom: hp(10),
  },

  /* Recording container */
  recordingContainer: {
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
  micButton: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c9a84c',
  },
  micButtonActive: {
    backgroundColor: 'rgba(231,76,60,0.3)',
    borderColor: '#e74c3c',
  },
  recordingStatusText: {
    flex: 1,
    fontSize: hp(14),
    color: '#fff',
    fontFamily: FONTS.REGULAR,
    marginLeft: wp(12),
  },
  clearBtn: {
    padding: wp(8),
  },
  clearBtnTxt: {
    fontSize: wp(18),
  },

  /* Answer input */
  answerInput: {
    width: '100%',
    minHeight: hp(90),
    color: '#fff',
    fontSize: hp(14),
    fontFamily: FONTS.REGULAR,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: wp(16),
    paddingVertical: hp(12),
    marginBottom: hp(12),
  },
  validateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#c9a84c',
    borderRadius: 50,
    paddingVertical: hp(14),
    marginBottom: hp(12),
    shadowColor: '#c9a84c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 10,
  },
  validatedAnswerContainer: {
    width: '100%',
    backgroundColor: 'rgba(26,46,88,0.9)',
    borderRadius: 12,
    paddingHorizontal: wp(14),
    paddingVertical: hp(10),
    marginBottom: hp(12),
    overflow: 'hidden',
  },
  validatedAnswerLabel: {
    color: '#c9a84c',
    fontSize: hp(13),
    fontFamily: FONTS.SEMIBOLD,
    marginBottom: hp(2),
  },
  validatedAnswerText: {
    color: '#fff',
    fontSize: hp(15),
    lineHeight: hp(20),
    fontFamily: FONTS.REGULAR,
    maxHeight: hp(40),   // exactly 2 lines (2 × lineHeight 20)
    overflow: 'hidden',
  },

  /* Submit / Next button */
  submitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a3360',
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#c9a84c',
    paddingVertical: hp(14),
    shadowColor: '#c9a84c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  submitTxt: {
    color: '#fff',
    fontSize: hp(16),
    fontFamily: FONTS.SEMIBOLD,
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
    gap: wp(12),
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 50,
    borderWidth: 1.2,
    borderColor: 'rgba(201,168,76,0.4)',
    paddingVertical: hp(14),
  },
  navBtnDisabled: {
    opacity: 0.3,
  },
  navBtnTxt: {
    color: '#fff',
    fontSize: hp(16),
    fontFamily: FONTS.MEDIUM,
  },
});

export default styles;
