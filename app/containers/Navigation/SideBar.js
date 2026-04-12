import logger from '../../utils/logger';
import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useSelector, useDispatch } from 'react-redux';
import get from 'lodash/get';
import styles from './styles';
import strings from '../../../i18n';
import { ImageBackground } from 'react-native';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { Navigation } from '../../constants/constants';
import { hp, wp } from '../../utils/responsive';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SideBar = (props) => {
  const DEFAULT_IMAGE = 'https://www.w3schools.com/howto/img_avatar.png';
  const { SideBar: sideBarMessage } = strings;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const refreshToken = useSelector((state) => state.app.refreshToken);

  const [isHelpExpanded, setIsHelpExpanded] = useState(false);
  const [isSocialExpanded, setIsSocialExpanded] = useState(false);
  const [isSettingExpanded, setIsSettingExpanded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Reset expanded states whenever the drawer comes into focus (is opened)
      setIsHelpExpanded(false);
      setIsSocialExpanded(false);
      setIsSettingExpanded(false);
    }, []),
  );

  const customAnimation = {
    duration: 800,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.opacity,
      springDamping: 0.7,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7,
    },
    delete: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.opacity,
      springDamping: 0.7,
    },
  };

  const toggleHelp = () => {
    LayoutAnimation.configureNext(customAnimation);
    setIsHelpExpanded(!isHelpExpanded);
  };

  const toggleSocial = () => {
    LayoutAnimation.configureNext(customAnimation);
    setIsSocialExpanded(!isSocialExpanded);
  };

  const toggleSetting = () => {
    LayoutAnimation.configureNext(customAnimation);
    setIsSettingExpanded(!isSettingExpanded);
  };

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
              label={({ color }) => (
                <CustomText style={[styles.label, { color }]}>
                  {sideBarMessage.chapters.defaultMessage}
                </CustomText>
              )}
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
              label={({ color }) => (
                <CustomText style={[styles.label, { color }]}>
                  {sideBarMessage.ideal.defaultMessage}
                </CustomText>
              )}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.User height="100%" width="100%" />
                </View>
              )}

              onPress={() => props.navigation.navigate(Navigation.OurIdeals)}
            />
          </View>
          <View style={styles.draweritems}>
            <DrawerItem
              label={({ color }) => (
                <CustomText style={[styles.label, { color }]}>
                  {sideBarMessage?.studentGift?.defaultMessage || 'My Prize'}
                </CustomText>
              )}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Contact height="100%" width="100%" />
                </View>
              )}

              onPress={() => props.navigation.navigate(Navigation.StudentGift)}
            />
          </View>
          <View style={styles.draweritems}>
            <DrawerItem
              label={({ color }) => (
                <CustomText style={[styles.label, { color }]}>
                  {sideBarMessage?.teacherGift?.defaultMessage || 'Teach Gita'}
                </CustomText>
              )}
              icon={() => (
                <View style={styles.icon}>
                  <IMAGES.Contact height="100%" width="100%" />
                </View>
              )}

              onPress={() => props.navigation.navigate(Navigation.TeachGeeta)}
            />
          </View>
          <View style={styles.draweritems}>
            <TouchableOpacity
              onPress={toggleSetting}
              style={[
                styles.drawerHeader,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: hp(15),
                  paddingLeft: wp(15),
                },
              ]}
            >
              <CustomText style={[styles.drawerHeading, { marginLeft: 0 }]}>
                {sideBarMessage.setting.defaultMessage}
              </CustomText>
              <View style={{ width: wp(12), height: hp(12) }}>
                <IMAGES.ChevronDown
                  height="100%"
                  width="100%"
                  style={{
                    transform: [
                      { rotate: isSettingExpanded ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {isSettingExpanded && (
              <DrawerItem
                label={({ color }) => (
                  <CustomText style={[styles.label, { color }]}>
                    {sideBarMessage.language.defaultMessage}
                  </CustomText>
                )}
                icon={() => (
                  <View style={styles.icon}>
                    <IMAGES.Message height="100%" width="100%" />
                  </View>
                )}

                onPress={() => props.navigation.navigate(Navigation.Language)}
              />
            )}
          </View>
          <View style={styles.draweritems}>
            <TouchableOpacity
              onPress={toggleHelp}
              style={[
                styles.drawerHeader,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: hp(15),
                  paddingLeft: wp(15),
                },
              ]}
            >
              <CustomText style={[styles.drawerHeading, { marginLeft: 0 }]}>
                {sideBarMessage.helpSupport.defaultMessage}
              </CustomText>
              <View style={{ width: wp(12), height: hp(12) }}>
                <IMAGES.ChevronDown
                  height="100%"
                  width="100%"
                  style={{
                    transform: [{ rotate: isHelpExpanded ? '180deg' : '0deg' }],
                  }}
                />
              </View>
            </TouchableOpacity>

            {isHelpExpanded && (
              <>
                <DrawerItem
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.contactUs.defaultMessage}
                    </CustomText>
                  )}
                  icon={() => (
                    <View style={styles.icon}>
                      <IMAGES.Contact height="100%" width="100%" />
                    </View>
                  )}

                  onPress={() => props.navigation.navigate(Navigation.ContactUs)}
                />
                <DrawerItem
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.privacyPolicy.defaultMessage}
                    </CustomText>
                  )}
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
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.termOfUse.defaultMessage}
                    </CustomText>
                  )}
                  icon={() => (
                    <View style={styles.icon}>
                      <IMAGES.TermsOfUse height="100%" width="100%" />
                    </View>
                  )}

                  onPress={() => props.navigation.navigate(Navigation.TermsOfUse)}
                />
                <DrawerItem
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.instruction.defaultMessage}
                    </CustomText>
                  )}
                  icon={() => (
                    <View style={styles.icon}>
                      <IMAGES.InfoIcon height="100%" width="100%" />
                    </View>
                  )}

                  onPress={() =>
                    props.navigation.navigate(Navigation.Instructions)
                  }
                />
              </>
            )}
          </View>
          <View style={styles.draweritems}>
            <TouchableOpacity
              onPress={toggleSocial}
              style={[
                styles.drawerHeader,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingRight: hp(15),

                  paddingLeft: wp(15),
                },
              ]}
            >
              <CustomText style={[styles.drawerHeading, { marginLeft: 0 }]}>
                {sideBarMessage.social.defaultMessage}
              </CustomText>
              <View style={{ width: wp(12), height: hp(12) }}>
                <IMAGES.ChevronDown
                  height="100%"
                  width="100%"
                  style={{
                    transform: [
                      { rotate: isSocialExpanded ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </View>
            </TouchableOpacity>

            {isSocialExpanded && (
              <>
                <DrawerItem
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.fb.defaultMessage}
                    </CustomText>
                  )}
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
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.insta.defaultMessage}
                    </CustomText>
                  )}
                  icon={() => (
                    <View style={styles.icon}>
                      <IMAGES.Instragram height="100%" width="100%" />
                    </View>
                  )}

                  onPress={() => {
                    Linking.openURL(
                      'https://www.instagram.com/saralgitaapp',
                    ).catch((err) =>
                      logger.error('Failed to open Instagram URL:', err),
                    );
                  }}
                />
                <DrawerItem
                  label={({ color }) => (
                    <CustomText style={[styles.label, { color }]}>
                      {sideBarMessage.x.defaultMessage}
                    </CustomText>
                  )}
                  icon={() => (
                    <View style={styles.icon}>
                      <IMAGES.Twitter height="100%" width="100%" />
                    </View>
                  )}

                  onPress={() => {
                    logger.log('Twitter navigation not implemented');
                  }}
                />
              </>
            )}
          </View>
        </DrawerContentScrollView>
      </View >
    </View >
  );
};

SideBar.propTypes = {
  ...SideBar,
};

export default SideBar;
