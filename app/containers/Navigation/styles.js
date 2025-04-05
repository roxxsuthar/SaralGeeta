import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBg: {
    height: hp(120),
    overflow: "hidden"
  },
  bgImage:{
    height:hp(700),
    marginTop:hp(-10),
  },
  header:{
    flex:1,
    flexDirection:'row',
    marginLeft:hp(15),
    alignItems:"flex-end",
    marginBottom:hp(10),
  },
 
  profilePic:{
    height:hp(60),
    width:wp(60),
  },
  profile:{
    marginBottom:hp(10),
    marginLeft:hp(10),
  },
  profileName:{
    color: COLORS.black, 
    fontSize: hp(18),
    fontWeight: '600',
  },
  viewProfileBtn:{
    color: COLORS.black, 
    fontSize: hp(15),
    fontWeight: '400',
  },
  draweritems: {
    flex:1,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGray, 
  },
  icon: {
    height: hp(24),
    width: wp(24),
    marginRight:hp(10)
  },
  label: {
    color: COLORS.black, 
    fontSize: hp(15),
    fontWeight: '500',
  },
  drawerHeading:{
    marginVertical:hp(12),
    marginLeft:hp(15),
    color: COLORS.black, 
    fontSize: hp(15),
    fontWeight: '600',
    lineHeight:hp(21)
  }
});
export default styles;
