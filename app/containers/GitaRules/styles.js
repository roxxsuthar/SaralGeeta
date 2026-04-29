import { StyleSheet, Platform, Dimensions } from 'react-native';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 15,
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 12,
    paddingTop: 25,
  },
  introContainer: {
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 10,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingTop: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    height: 100,
    textAlignVertical: 'top',
  },
  rulesList: {
    flex: 1,
    marginBottom: 20,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: COLORS.orange,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 22,
  },
  ruleTextChecked: {
    color: COLORS.orange,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingVertical: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: COLORS.orange,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default styles;
