import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: wp(16),
    marginTop: hp(35), // Removed - SafeAreaView handles this now
  },
  headerText: {
    fontSize: hp(17),
    lineHeight: hp(22),
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(10),
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: hp(10),
    paddingHorizontal: 12,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: hp(1),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingVertical: 8,
  },
  voiceButton: {
    width: hp(40),
    height: hp(40),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
  cardImage: {
    height: hp(170),
    borderRadius: hp(10),
  },

  recentCardText: {
    fontSize: hp(12),
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.firefly,
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
    position: 'absolute',
    borderRadius: hp(10),
    paddingHorizontal: wp(10),
    paddingVertical: hp(8),
    borderWidth: hp(1),
    borderColor: COLORS.firefly,
    height: hp(40),
    width: hp(40),
    marginTop: hp(85),
    marginLeft: wp(150),
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
  iconPlay: {
    height: hp(20),
    width: wp(20),
    color: '#ffffff',
  },
  headerContainer: {
    height: hp(43),
    marginTop: hp(10),
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
  recentViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: hp(20),
    padding: hp(16),
  },
  recentTextContainer: {
    height: hp(70),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioCardText: {
    fontSize: hp(18),
    lineHeight: hp(22),
    fontWeight: '400',
    color: COLORS.black,
    textAlign: 'center',
  },
});

export default styles;
