import logger from '../../utils/logger';
import React from 'react';
import {
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
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

const SideBar = (props) => {
  const DEFAULT_IMAGE = 'https://www.w3schools.com/howto/img_avatar.png';
  const { SideBar: sideBarMessage } = strings;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const refreshToken = useSelector((state) => state.app.refreshToken);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={{ height: 50 }} />

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
              onPress={() =>
                props.navigation.navigate('HomeStack', {
                  screen: Navigation.Home,
                })
              }
            />
          </View>
          <View style={styles.draweritems}>
            <DrawerItem
              label={sideBarMessage.ideal.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.User height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.OurIdeals)}
            />
          </View>
           <DrawerItem
              label={sideBarMessage.language.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Message height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.Language)}
            />
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
              onPress={() => props.navigation.navigate(Navigation.PrivacyPolicy)}
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
            <DrawerItem
              label={sideBarMessage.instruction.defaultMessage}
              labelStyle={styles.label}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.InfoIcon height="100%" width="100%" />
                </View>
              )}
              onPress={() => props.navigation.navigate(Navigation.Instructions)}
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
                Linking.openURL(
                  'https://www.facebook.com/people/Saral-Gita/61577334227489/',
                ).catch((err) =>
                  logger.error('Failed to open Facebook URL:', err),
                );
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
                Linking.openURL('https://www.instagram.com/saralgitaapp').catch(
                  (err) => logger.error('Failed to open Instagram URL:', err),
                );
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
                logger.log('Twitter navigation not implemented');
              }}
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
