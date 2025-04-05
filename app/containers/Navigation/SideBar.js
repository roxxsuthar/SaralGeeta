import React from 'react';
import { View, Image, StatusBar, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import styles from './styles';
import { ImageBackground } from 'react-native';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';

const SideBar = (props) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={IMAGES.AppBackground}
        style={styles.headerBg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <Image source={IMAGES.Avatar} style={styles.profilePic} />
          <View style={styles.profile}>
            <CustomText style={styles.profileName}>Jane Cooper</CustomText>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => props.navigation.navigate('Profile')}
            >
              <CustomText style={styles.viewProfileBtn}>
                View Profile
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <SafeAreaView style={styles.container}>
        <DrawerContentScrollView {...props}>
          <View style={styles.draweritems}>
            <DrawerItem
              label="Dashboard"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.DashBoard height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('Home')}
            />
            <DrawerItem
              label="Chapters"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Contact height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('Chapters')}
            />
            <DrawerItem
              label="Notifications"
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Bell height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate('Notifications')}
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
              onPress={() => props.navigation.navigate('')}
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
