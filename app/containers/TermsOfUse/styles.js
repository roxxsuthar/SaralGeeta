import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center", 
    justifyContent:"center",
    position: "relative",
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
      position: "absolute",
      left: hp(16), 
    },
    mainContainer:{
      backgroundColor:COLORS.white,
      height: hp(722),
      borderTopLeftRadius: wp(20), 
      borderTopRightRadius: wp(20),
      overflow: "hidden",
  
    },
    scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp(20),
  },
    policyContainer:{
      padding: hp(15),
      gap:hp(10),
    },
    lable:{
      fontWeight: "700",
      fontSize: hp(28),
      color: COLORS.orange,
      lineHeight: hp(40),
    },
    policyText:{
      fontWeight: "400",
      fontSize: hp(15),
      color: COLORS.black,
      lineHeight: hp(22),
    }
});

export default styles;
