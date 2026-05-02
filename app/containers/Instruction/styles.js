import { StyleSheet, Platform } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  mainContainer: {
    backgroundColor: '#FEF9F5',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingTop: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(20),
  },
  policyContainer: {
    padding: hp(15),
    gap: hp(10),
  },
  lable: {
    fontWeight: '700',
    fontSize: hp(28),
    color: COLORS.orange,
    lineHeight: hp(40),
    fontFamily: 'Outfit-Bold',
  },
  policyText: {
    fontWeight: '400',
    fontSize: hp(15),
    color: COLORS.black,
    lineHeight: hp(22),
    fontFamily: 'Outfit-Regular',
  },
  section: {
    marginBottom: 20,
  },
  heading1: {
    fontSize: hp(22),
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  heading2: {
    fontSize: hp(22),
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  heading3: {
    fontSize: hp(20),
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Outfit-Bold',
  },
  subHeading: {
    fontSize: hp(18),
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Outfit-Bold',
  },
  bodyText: {
    fontSize: hp(18),
    lineHeight: 25,
    marginBottom: 10,
    fontFamily: 'Outfit-Regular',
  },
  bodyTextJustify: {
    fontSize: hp(18),
    lineHeight: 25,
    marginBottom: 10,
    textAlign: 'justify',
    fontFamily: 'Outfit-Regular',
  },
  boldText: {
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  bulletList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  bulletItem: {
    fontSize: hp(18),
    lineHeight: 25,
    marginBottom: 5,
    fontFamily: 'Outfit-Regular',
  },
  numberedList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  numberedItem: {
    fontSize: hp(18),
    lineHeight: 25,
    marginBottom: 5,
    fontFamily: 'Outfit-Regular',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(50),
  },
  loadingText: {
    marginTop: hp(15),
    fontSize: hp(16),
    color: COLORS.black,
    fontFamily: 'Outfit-Regular',
  },
});

export default styles;
