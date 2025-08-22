import React from 'react';
import { View, Image, StatusBar, TouchableOpacity } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import styles from './styles';
import strings from '../../../i18n';
import { ImageBackground } from 'react-native';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { Navigation } from '../../constants/constants';
import { logOutUser } from '../App/actions';

const SideBar = (props) => {
  const { SideBar: sideBarMessage } = strings;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const refreshToken = useSelector((state) => state.app.refreshToken);

  const logOut = () => {
    dispatch(logOutUser({ refresh: refreshToken }));
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
          <Image source={{ uri: user?.profile }} style={styles.profilePic} />
          <View style={styles.profile}>
            <CustomText
              style={styles.profileName}
            >{`${get(user, 'first_name')} ${get(user, 'last_name')}`}</CustomText>
            <CustomText style={styles.viewProfileBtn}>
              {sideBarMessage.viewAll.defaultMessage}
            </CustomText>
          </View>
        </TouchableOpacity>
      </ImageBackground>

      <View style={styles.container}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ paddingTop: 0 }}
        >
          <View style={styles.draweritems}>
            <DrawerItem
              label={sideBarMessage.chapters.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.DashBoard height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.Home)}
            />
          </View>
          <View style={styles.draweritems}>
            <CustomText style={styles.drawerHeading}>
              {sideBarMessage.helpSupport.defaultMessage}
            </CustomText>
            <DrawerItem
              label={sideBarMessage.contactUs.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Contact height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.ContactUs)}
            />
            <DrawerItem
              label={sideBarMessage.privacyPolicy.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Privacy height="100%" width="100%" />
                </View>
              )}
              onPress={() =>
                props.navigation.navigate(Navigation.PrivacyPolicy)
              }
            />
            <DrawerItem
              label={sideBarMessage.termOfUse.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.TermsOfUse height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.TermsOfUse)}
            />
          </View>
          <View style={styles.draweritems}>
            <CustomText style={styles.drawerHeading}>
              {sideBarMessage.social.defaultMessage}
            </CustomText>
            <DrawerItem
              label={sideBarMessage.fb.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Facebook height="100%" width="100%" />
                </View>
              )}
              onPress={() => {
                // Handle Facebook navigation or remove if not needed
                console.log('Facebook navigation not implemented');
              }}
            />
            <DrawerItem
              label={sideBarMessage.insta.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Instragram height="100%" width="100%" />
                </View>
              )}
              onPress={() => {
                // Handle Instagram navigation or remove if not needed
                console.log('Instagram navigation not implemented');
              }}
            />
            <DrawerItem
              label={sideBarMessage.x.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Twitter height="100%" width="100%" />
                </View>
              )}
              onPress={() => {
                // Handle Twitter navigation or remove if not needed
                console.log('Twitter navigation not implemented');
              }}
            />
            <DrawerItem
              label={sideBarMessage.signOut.defaultMessage}
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
      </View>
    </View>
  );
};

SideBar.propTypes = {
  ...SideBar,
};

export default SideBar;
