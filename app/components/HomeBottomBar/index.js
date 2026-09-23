import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Linking,
  Platform,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

import { IMAGES } from '../../constants';
import { Navigation } from '../../constants/constants';
import CustomText from '../CustomText';
import strings from '../../../i18n';
import styles from './styles';

const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

function HomeBottomBar({ bottomInset, showGuide, onNavigateToDrawerScreen }) {
  const [isSocialExpanded, setIsSocialExpanded] = useState(false);
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const { HomeBottomBar: messages } = strings;

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  const storeUrl = Platform.OS === 'android'
    ? 'https://play.google.com/store/apps/details?id=com.saralgita'
    : 'https://apps.apple.com/kz/app/saral-gita/id6754391932';

  const navigateToDrawerScreen = (screen) => {
    onNavigateToDrawerScreen(screen);
  };

  const toggleSocialMenu = () => {
    setIsSocialExpanded((expanded) => !expanded);
    setIsMenuExpanded(false);
  };

  const toggleAppMenu = () => {
    setIsMenuExpanded((expanded) => !expanded);
    setIsSocialExpanded(false);
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: `${strings.Home.shareMessage.defaultMessage} \nhttps://app.saralgita.in/share`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderSocialMenu = () => {
    if (!isSocialExpanded) return null;

    return (
      <View style={styles.expandedMenuContainer}>
        <View style={styles.expandedMenuOverlay}>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://www.facebook.com/people/Saral-Gita/61577334227489/')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.FacebookIcon width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{messages.facebook.defaultMessage}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://www.instagram.com/saralgitaapp')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.InstagramIcon width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{messages.instagram.defaultMessage}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => openLink('https://twitter.com/')}>
            <View style={styles.menuIconWrapper}>
              <IMAGES.TwitterX width={30} height={30} />
            </View>
            <CustomText style={styles.menuItemText}>{messages.twitter.defaultMessage}</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderGridMenu = () => {
    if (!isMenuExpanded) return null;

    return (
      <View style={styles.expandedMenuContainer}>
        <View style={styles.gridMenuOverlay}>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigateToDrawerScreen(Navigation.FAQ)}>
              <IMAGES.FaqNew width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.faq.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigateToDrawerScreen(Navigation.Language)}>
              <IMAGES.LanguageNew width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.language.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => openLink(storeUrl)}>
              <IMAGES.UpdateApp width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.update.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={shareApp}>
              <IMAGES.ShareApp width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.shareApp.defaultMessage}</CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.gridRow}>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => openLink(storeUrl)}>
              <IMAGES.StarOutline width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.rating.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigateToDrawerScreen(Navigation.ContactUs)}>
              <IMAGES.ContactPhone width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.contact.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={() => navigateToDrawerScreen(Navigation.Instructions)}>
              <IMAGES.HelpSquare width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.help.defaultMessage}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.gridMenuItem} onPress={toggleSocialMenu}>
              <IMAGES.SocialBubbles width={24} height={24} />
              <CustomText style={styles.menuItemText}>{messages.social.defaultMessage}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {(isSocialExpanded || isMenuExpanded) && (
        <TouchableOpacity
          style={styles.fullScreenOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsSocialExpanded(false);
            setIsMenuExpanded(false);
          }}
        />
      )}
      {renderSocialMenu()}
      {renderGridMenu()}
      <View style={[styles.bottomBarContainer, { bottom: bottomInset + 20 }]}>
        <TouchableOpacity style={styles.bottomBarIconContainer} onPress={() => openLink(storeUrl)}>
          <IMAGES.StarOutline width={26} height={26} />
        </TouchableOpacity>
        <View style={styles.bottomBarDivider} />
        <TouchableOpacity style={styles.bottomBarIconContainer} onPress={() => navigateToDrawerScreen(Navigation.ContactUs)}>
          <IMAGES.ContactPhone width={26} height={26} />
        </TouchableOpacity>
        <View style={styles.bottomBarDivider} />
        <TouchableOpacity style={styles.bottomBarIconContainer} onPress={() => navigateToDrawerScreen(Navigation.FAQ)}>
          <IMAGES.FaqNew width={26} height={26} />
        </TouchableOpacity>
        <View style={styles.bottomBarDivider} />
        <TouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleSocialMenu}>
          <IMAGES.SocialBubbles width={26} height={26} />
        </TouchableOpacity>
        <View style={styles.bottomBarDivider} />
        {showGuide ? (
          <CopilotStep
            text={strings.Copilot.homeBottomBar.defaultMessage}
            order={4}
            name="bottomBar"
          >
            <CopilotTouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleAppMenu}>
              <IMAGES.AppsGrid width={26} height={26} />
            </CopilotTouchableOpacity>
          </CopilotStep>
        ) : (
          <TouchableOpacity style={styles.bottomBarIconContainer} onPress={toggleAppMenu}>
            <IMAGES.AppsGrid width={26} height={26} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

HomeBottomBar.propTypes = {
  bottomInset: PropTypes.number,
  showGuide: PropTypes.bool,
  onNavigateToDrawerScreen: PropTypes.func.isRequired,
};

HomeBottomBar.defaultProps = {
  bottomInset: 0,
  showGuide: true,
};

export default HomeBottomBar;
