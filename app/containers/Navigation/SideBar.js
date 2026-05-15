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
      <ImageBackground
        source={IMAGES.AppBackground}
        style={styles.container}
      >
        <View style={styles.sidebarContainer}>
          <StatusBar hidden={false} barStyle="light-content" translucent backgroundColor="transparent" />
          <View style={styles.header}>
            <Image
              source={IMAGES.AppLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ paddingTop: 0 }}
            showsVerticalScrollIndicator={false}
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
              <DrawerItem
                label={({ color }) => (
                  <CustomText style={[styles.label, { color }]}>
                    {sideBarMessage?.writeGita?.defaultMessage || 'Write Gita'}
                  </CustomText>
                )}
                icon={() => (
                  <View style={styles.icon}>
                    <IMAGES.Contact height="100%" width="100%" />
                  </View>
                )}
                onPress={() => props.navigation.navigate(Navigation.WriteGita)}
              />
            </View>
            <View style={styles.draweritems}>
              <DrawerItem
                label={({ color }) => (
                  <CustomText style={[styles.label, { color }]}>
                    {sideBarMessage?.gitaRules?.defaultMessage || 'Gita Rules'}
                  </CustomText>
                )}
                icon={() => (
                  <View style={styles.icon}>
                    <IMAGES.Contact height="100%" width="100%" />
                  </View>
                )}
                onPress={() => props.navigation.navigate(Navigation.GitaRules)}
              />
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
                  },
                ]}
              >
                <CustomText style={styles.drawerHeading}>
                  {sideBarMessage.helpSupport.defaultMessage}
                </CustomText>
                <View style={{ width: 12, height: 12 }}>
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
                        {sideBarMessage?.faq?.defaultMessage || 'FAQ'}
                      </CustomText>
                    )}
                    icon={() => (
                      <View style={styles.icon}>
                        <IMAGES.FaqNew height="100%" width="100%" />
                      </View>
                    )}
                    onPress={() => props.navigation.navigate(Navigation.FAQ)}
                  />
                </>
              )}
            </View>
          </DrawerContentScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

SideBar.propTypes = {
  ...SideBar,
};

export default SideBar;
