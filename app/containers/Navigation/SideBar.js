import React from 'react';
import { View, Image, StatusBar, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import styles from './styles';
import { ImageBackground } from 'react-native';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from '../../constants/constants';
import { logOutUser } from '../App/actions';

const SideBar = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  const logOut = () => {
    dispatch(logOutUser());
    props.navigation?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Navigation.Login }],
      }),
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={IMAGES.AppBackground}
        style={styles.headerBg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => props.navigation.navigate(Navigation.Profile)}
          style={styles.header}
        >
          <Image source={IMAGES.Avatar} style={styles.profilePic} />
          <View style={styles.profile}>
            <CustomText
              style={styles.profileName}
            >{`${get(user, 'first_name')} ${get(user, 'last_name')}`}</CustomText>
            <CustomText style={styles.viewProfileBtn}>View Profile</CustomText>
          </View>
        </TouchableOpacity>
      </ImageBackground>

      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView {...props}>
          <View style={styles.draweritems}>
            <DrawerItem
              label="Chapters"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.DashBoard height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('Home')}
            />
          </View>
          <View style={styles.draweritems}>
            <CustomText style={styles.drawerHeading}>Help & Support</CustomText>
            <DrawerItem
              label="Contact Us"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Contact height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('ContactUs')}
            />
            <DrawerItem
              label="Privacy Policy"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Privacy height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('PrivacyPolicy')}
            />
            <DrawerItem
              label="Terms Of Use"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.TermsOfUse height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('TermsOfUse')}
            />
          </View>
          <View style={styles.draweritems}>
            <CustomText style={styles.drawerHeading}>
              Social media Links
            </CustomText>
            <DrawerItem
              label="Facebook"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Facebook height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('')}
            />
            <DrawerItem
              label="Instagram"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Instragram height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('')}
            />
            <DrawerItem
              label="Twitter"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Twitter height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('')}
            />
            <DrawerItem
              label="Sign Out"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.SignOut height="100%" width="100%" />
                </View>
              )}
              onPress={() => logOut()}
            />
          </View>
        </DrawerContentScrollView>
      </SafeAreaView>
    </View>
  );
};

SideBar.propTypes = {
  ...SideBar,
};

export default SideBar;
