import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    backgroundColor: COLORS.white,
    height: hp(722),
    padding: wp(20),
    gap: hp(20),
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    overflow: 'hidden',
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
  inputIcon: {
    position: 'absolute',
    top: hp(10),
    right: hp(10),
    width: wp(20),
    height: hp(20),
  },
  iconContainer: {
    position: 'absolute',
    left: hp(16),
  },
  inputContainer: {
    gap: hp(5),
  },
  label: {
    fontWeight: '600',
    fontSize: hp(14),
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: hp(12),
    paddingVertical: hp(8),
    paddingHorizontal: hp(10),
    fontSize: hp(14),
    fontWeight: '400',
    color: COLORS.black,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: hp(12),
    paddingBottom: hp(80),
    paddingHorizontal: hp(16),
    fontSize: hp(14),
    fontWeight: '400',
    color: COLORS.black,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: "column",
  },
  button: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: hp(40),
    borderRadius: wp(12),
  },
  buttonText: {
    color: COLORS.black,
    fontSize: hp(15),
    fontWeight: '600',
    lineHeight: hp(22),
    marginLeft: hp(5),
  },
});

export default styles;
