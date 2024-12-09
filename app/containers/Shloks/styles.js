import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';
import { head } from 'lodash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chakraStyle: {
    position: 'absolute',
    right: hp(-200),
    top: hp(-200),
    height: hp(450),
    width: hp(470),
  },
  chapterImage: {
    height: hp(60),
    width: hp(60),
    borderRadius: hp(75),
  },
  mainContainer: {
    flex: 1,

    marginTop: hp(69),
  },
  header: { marginHorizontal: wp(16) },
  headerText: {
    fontSize: hp(17),
    lineHeight: hp(22),
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  headerComponent: {
    flexDirection: 'row',
    marginTop: hp(30),
    alignItems: 'center',
    marginHorizontal: wp(16),
  },
  headerComponentText: {
    fontSize: hp(20),
    fontWeight: '600',
    lineHeight: hp(30),
    color: COLORS.black,
    marginLeft: wp(10),
  },
  headerComponentDescription: {
    fontSize: hp(15),
    fontWeight: '400',
    lineHeight: hp(24),
    color: COLORS.black,
    marginTop: hp(10),
    marginHorizontal: wp(16),
  },
  flatListContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: hp(20),
    borderTopRightRadius: hp(20),
    marginTop: hp(20),
  },
  handle: {
    marginTop: hp(10),
    width: wp(70),
    height: hp(5),
    borderRadius: hp(10),
    backgroundColor: COLORS.alto,
    alignSelf: 'center',
  },
  cardContainer: {
    padding: hp(16),
    backgroundColor: COLORS.white,
    borderWidth: hp(1),
    borderColor: COLORS.alto,
    borderRadius: hp(20),
    flexDirection: 'row',
  },
  cardImage: {
    height: hp(80),
    width: wp(75),
    borderRadius: hp(6),
  },
  contentContainerStyle: {
    flexGrow: 1,
    marginTop: hp(10),
    paddingHorizontal: wp(16),
  },
  itemSeparator: {
    height: hp(20),
  },
  cardTitle: {
    fontSize: hp(20),
    fontWeight: '600',
    lineHeight: hp(30),
    color: COLORS.doveGray,
  },
  languageText: {
    fontSize: hp(15),
    fontWeight: '500',
    lineHeight: hp(22),
    color: COLORS.doveGray,
  },
  textContainer: {
    marginLeft: wp(15),
  },
  timeText: {
    fontSize: hp(15),
    fontWeight: '400',
    lineHeight: hp(22),
    color: COLORS.doveGray,
  },
});

export default styles;
