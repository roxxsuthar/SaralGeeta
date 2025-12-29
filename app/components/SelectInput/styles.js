import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: hp(12),
    height: hp(44),
    paddingHorizontal: hp(10),
    fontSize: hp(14),
    fontWeight: '400',
    color: COLORS.black,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: hp(14),
  },
  icon: {
    height: hp(24),
    width: wp(24),
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: hp(12),
    elevation: 4,
    paddingHorizontal: hp(10),
    marginTop: hp(-12), 
  },
  option: {
    paddingVertical: hp(14),
    borderBottomColor: COLORS.lightGray,
  },
  optionText: {
    fontSize: hp(14),
    color: COLORS.black,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: hp(14),
    color: COLORS.gray,
  },
});
