import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp(16),
    marginTop: hp(35),
  },
  headerText: {
    fontSize: hp(17),
    lineHeight: hp(22),
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  sectionHeaderContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sectionHeader: {
    fontSize: hp(15),
    fontWeight: '700',
    lineHeight: hp(22),
    color: COLORS.black,
  },
  recentViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    padding: hp(10),
    flexDirection: 'row',
  },
  cardImage: {
    height: hp(80),
    width: hp(80),
    borderRadius: hp(12),
  },
  recentCardText: {
    fontSize: hp(12),
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.firefly,
  },
  recentTextContainer: {
    marginLeft: wp(10),
    width: wp(233),
  },
  recentCardTimeText: {
    fontSize: hp(12),
    lineHeight: hp(16),
    fontWeight: '400',
    color: COLORS.firefly,
    marginTop: hp(10),
  },
  progressBackground: {
    height: hp(12),
    backgroundColor: COLORS.cinderella,
    borderRadius: hp(10),
    overflow: 'hidden',
    marginTop: hp(10),
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.flamingo,
    borderRadius: hp(10),
  },
  separator: {
    height: hp(20),
  },
  header: {
    height: hp(43),
    marginBottom: hp(10),
  },
  sectionViewAll: {
    fontSize: hp(15),
    lineHeight: hp(22),
    fontWeight: '500',
    color: COLORS.firefly,
  },
  AudioContainer: {
    flex: 1,
  },
  audioCardImage: {
    height: hp(170),
    borderTopRightRadius: hp(10),
    borderTopLeftRadius: hp(10),
    backgroundColor: 'yellow',
  },
  audioTextContainer: {
    marginTop: hp(-16),
    backgroundColor: COLORS.white,
    padding: hp(15),
    borderRadius: hp(10),
  },
  audioCardTitle: {
    fontSize: hp(15),
    lineHeight: hp(22),
    fontWeight: '700',
    color: COLORS.firefly,
  },
  audioCardDescription: {
    fontSize: hp(14),
    lineHeight: hp(20),
    fontWeight: '400',
    color: COLORS.firefly,
    marginTop: hp(5),
  },
  iconContainer: {
    borderRadius: hp(10),
    paddingHorizontal: wp(10),
    paddingVertical: hp(8),
    borderWidth: hp(1),
    borderColor: COLORS.firefly,
    height: hp(40),
    width: hp(40),
    marginRight: wp(10),
  },
  imageContainer: {
    marginTop: wp(10),
    flexDirection: 'row',
  },
  oneXText: {
    fontSize: hp(15),
    lineHeight: hp(22),
    fontWeight: '700',
    color: COLORS.firefly,
    textAlign: 'center',
  },
  chakraStyle: {
    position: 'absolute',
    right: hp(-200),
    top: hp(-200),
    height: hp(450),
    width: hp(470),
    opacity: 0.4,
  },
  headerSubContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: hp(24),
    width: hp(24),
  },
  headerContainer: {
    height: hp(43),
    marginBottom: hp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSearchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBellContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(20),
  },
  rightIconContainer: {
    flexDirection: 'row',
  },
});

export default styles;
