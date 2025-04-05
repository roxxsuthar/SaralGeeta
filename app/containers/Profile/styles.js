import {  StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { hp, wp } from '../../utils/responsive';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer:{
    backgroundColor:COLORS.white,
    height: hp(722),
    borderTopLeftRadius: wp(20), 
    borderTopRightRadius: wp(20),
    overflow: "hidden",

  },
  userDetails: {
    padding: wp(25),
    gap: hp(20)
  },
  detailTitle: {
    fontSize: hp(15),
    fontWeight: "400",
    lineHeight:hp(22),
    color:  COLORS.gray,
  },
  detailText: {
    fontSize: hp(15),
    fontWeight: "600",
    lineHeight:hp(22),
    color:  COLORS.black,
    marginTop:hp(5)
  },
  buttonContainer: {
    flexDirection: "column",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,  
    borderColor: COLORS.black, 
    paddingVertical: hp(10),
    paddingHorizontal: hp(15),
    borderRadius: wp(12),  
  },
  buttonText: {
    color: COLORS.black, 
    fontSize: hp(15),
    fontWeight:"600",
    lineHeight:hp(22),
    marginLeft:hp(5)
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
  footerImage: {
    position: "absolute",  
    top: hp(580),
    borderTopLeftRadius: wp(20), 
    borderTopRightRadius: wp(20),
    overflow: "hidden",
    width: "100%",
    height: "100%",  
    resizeMode: "cover",
  },
  footerContainer: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "center",
  },
  chakraImage: {
    position :"absolute",
    top : hp(0),
    width: hp(100),  
    height: hp(100),
    opacity: 0.5,
  },
  footerText: {
    position :"absolute",
    top : hp(80),
    color: COLORS.white,
    fontSize: hp(15),
  },
  iconContainer: {
    position: "absolute",
    left: hp(16), 
  },
  icon: {
    height: hp(24),
    width: wp(24),
  },
  heading: {
    fontWeight: '700',
    fontSize: hp(17),
    lineHeight: hp(22),
    color: COLORS.white,
  },
});

export default styles;
