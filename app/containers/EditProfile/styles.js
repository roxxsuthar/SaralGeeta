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
  iconContainer: {
    position: 'absolute',
    left: hp(16),
  },
  icon: {
    height: hp(15),
    width: wp(15),
  },
  heading: {
    fontWeight: '700',
    fontSize: hp(17),
    lineHeight: hp(22),
    color: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: wp(20),
  },
  formContainer: {
    gap: hp(20),
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
    borderWidth: hp(1),
    borderColor: COLORS.black,
    borderRadius: hp(12),
    height: hp(44),
    paddingHorizontal: hp(10),
    fontSize: hp(14),
    fontWeight: '400',
    color: COLORS.black,
  },
  phoneContainer: {
    width: '100%',
    height: hp(44),
    borderRadius: hp(12),
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: 'transparent',
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  slider: {
    height: hp(20),
    width: wp(20),
    color: COLORS.white,
  },
  track: {
    height: hp(5),
    borderRadius: hp(10),
  },
  thumb: {
    height: hp(15),
    width: hp(15),
    backgroundColor: COLORS.orange,
    borderRadius: hp(15),
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: hp(45),
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
