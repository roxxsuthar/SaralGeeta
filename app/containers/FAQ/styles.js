import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  heading: {
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    flex: 1,
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // ── Main card container ──────────────────────────────────────────────────────
  mainContainer: {
    backgroundColor: '#FEF9F5',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingTop: hp(20),
  },
  subHeading: {
    fontSize: hp(14),
    fontFamily: 'Outfit-Regular',
    color: COLORS.doveGray,
    textAlign: 'center',
    paddingHorizontal: wp(20),
    marginBottom: hp(14),
  },
  scrollContent: {
    paddingHorizontal: wp(16),
    paddingBottom: hp(30),
  },

  // ── FAQ Item ─────────────────────────────────────────────────────────────────
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    marginBottom: hp(10),
    paddingHorizontal: wp(14),
    paddingVertical: hp(14),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0E8E2',
  },
  faqItemExpanded: {
    borderColor: COLORS.orange,
    borderWidth: 1.5,
    shadowOpacity: 0.12,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexBadge: {
    width: hp(26),
    height: hp(26),
    borderRadius: hp(13),
    backgroundColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(10),
    flexShrink: 0,
  },
  indexText: {
    fontSize: hp(12),
    fontFamily: 'Outfit-Bold',
    color: COLORS.white,
    lineHeight: hp(15),
  },
  questionText: {
    flex: 1,
    fontSize: hp(14),
    fontFamily: 'Outfit-SemiBold',
    color: COLORS.ebony,
    lineHeight: hp(20),
  },
  chevronWrapper: {
    width: 18,
    height: 18,
    marginLeft: wp(8),
    flexShrink: 0,
  },

  // ── Answer ───────────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#F0E8E2',
    marginVertical: hp(10),
  },
  answerContainer: {
    paddingLeft: hp(36),
  },
  answerText: {
    fontSize: hp(13),
    fontFamily: 'Outfit-Regular',
    color: COLORS.doveGray,
    lineHeight: hp(21),
    textAlign: 'justify',
  },
});

export default styles;
