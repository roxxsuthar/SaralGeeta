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
    marginTop: hp(128),
  },
  chakraStyle: {
    position: 'absolute',
    right: hp(-200),
    top: hp(-200),
    height: hp(450),
    width: hp(470),
  },
  heading: {
    fontSize: hp(24),
    lineHeight: hp(32),
    color: COLORS.black,
    fontWeight: '600',
  },
  contentContainerStyle: {
    paddingBottom: hp(24),
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    padding: hp(10),
  },
  boarderCardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    padding: hp(10),
    borderWidth: hp(1),
    borderColor: COLORS.black,
  },
  cardImage: {
    height: hp(80),
    width: hp(80),
    borderRadius: hp(12),
  },
  cardIconContainer: {
    height: hp(80),
    width: hp(80),
    borderRadius: hp(12),
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: hp(20),
    lineHeight: hp(30),
    color: COLORS.firefly,
    fontWeight: '700',
    width: wp(143),
  },
  cardIcon: {
    height: hp(62),
    width: hp(62),
  },
  flatListContainer: {
    flex: 1,
    marginTop: hp(20),
  },
  itemSeparator: {
    height: hp(20),
  },
  buttonLabel: {
    fontSize: hp(15),
    fontWeight: '700',
    color: COLORS.firefly,
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    width: 'auto',
    marginTop: hp(20),
  },
});

export default styles;
