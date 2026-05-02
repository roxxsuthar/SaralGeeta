import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: hp(15),
    fontFamily: 'Outfit-Regular',
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    elevation: 8,
    paddingHorizontal: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: hp(16),
    color: COLORS.black,
    fontFamily: 'Outfit-Medium',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: hp(15),
    color: COLORS.gray,
    fontFamily: 'Outfit-Regular',
    padding: 20,
  },
});
