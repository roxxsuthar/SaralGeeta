import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: hp(50),
  },
  heading: {
    fontWeight: '700',
    fontSize: hp(17),
    lineHeight: hp(22),
    color: COLORS.white,
  },
  icon: {
    height: hp(24),
    width: wp(24),
  },
  iconContainer: {
    position: 'absolute',
    left: hp(16),
  },
  mainContainer: {
    backgroundColor: COLORS.white,
    height: hp(722),
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    overflow: 'hidden',
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
  },
  policyText: {
    fontWeight: '400',
    fontSize: hp(15),
    color: COLORS.black,
    lineHeight: hp(22),
  },
  section: {
    marginBottom: 20,
  },
  heading1: {
    fontSize: 22, // Adjusted from 18px in the source HTML's h1
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
  },
  bodyTextJustify: {
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 10,
    // Note: React Native's Text component does not support `textAlign: 'justify'` on all platforms,
    // but we include it here as it was in the source HTML's style.
    textAlign: 'justify',
  },
  numberedList: {
    marginLeft: 15,
    marginBottom: 10,
  },
  numberedItem: {
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 5,
  },
});

export default styles;
