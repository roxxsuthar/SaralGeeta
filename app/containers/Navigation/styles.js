import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    height: hp(150),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  logo: {
    width: hp(80),
    height: hp(80),
    borderRadius: 20,
  },
  draweritems: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  label: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Outfit-SemiBold',
  },
  drawerHeading: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Outfit-Bold',
    paddingVertical: 15,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});

export default styles;
