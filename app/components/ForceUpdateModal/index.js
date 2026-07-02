/**
 * ForceUpdateModal
 *
 * Shown when the installed app version is below the minimum required version.
 * It is FULLY BLOCKING — no close button, back-press does nothing,
 * and tapping outside the modal does nothing.
 * The only way out is tapping "Update Now" which opens the store listing.
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  BackHandler,
} from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { COLORS, FONTS, IMAGES } from '../../constants';
import CustomText from '../CustomText';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

const STORE_URL = Platform.select({
  android: 'https://play.google.com/store/apps/details?id=com.saralgita',
  ios: 'https://apps.apple.com/kz/app/saral-gita/id6754391932',
});

export default function ForceUpdateModal() {

  const [visible, setVisible] = useState(false);
  const [storeUrl, setStoreUrl] = useState(STORE_URL);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const inAppUpdates = new SpInAppUpdates(false);
        const result = await inAppUpdates.checkNeedsUpdate();
        
        if (result.shouldUpdate) {
          if (Platform.OS === 'android') {
            // Android: use the official native blocking update UI
            inAppUpdates.startUpdate({
              updateType: IAUUpdateKind.IMMEDIATE,
            });
          } else {
            // iOS: use our custom non-dismissible modal
            if (result.storeUrl) {
              setStoreUrl(result.storeUrl);
            }
            setVisible(true);
          }
        }
      } catch (err) {
        console.log('Error checking for updates in ForceUpdateModal:', err);
      }
    };
    checkUpdate();
  }, []);

  // Block the Android hardware back button when the modal is visible.
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  const handleUpdate = async () => {
    try {
      await Linking.openURL(storeUrl);
    } catch {
      /* openURL can fail silently on simulators */
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // Non-dismissible: both props below prevent any close action
      onRequestClose={() => {/* intentionally blocked */}}
      statusBarTranslucent
    >
      {/* Solid dark overlay — not a TouchableOpacity so tapping outside does nothing */}
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <IMAGES.UpdateApp width={hp(36)} height={hp(36)} />
          </View>

          <CustomText style={styles.title}>Update Available</CustomText>
          <CustomText style={styles.subtitle}>
            A new version of Saral Gita is available with improvements and
            bug fixes. Please update to continue using the app.
          </CustomText>

          <TouchableOpacity
            style={styles.btn}
            onPress={handleUpdate}
            activeOpacity={0.85}
          >
            <CustomText style={styles.btnText}>Update Now</CustomText>
          </TouchableOpacity>

          {/* No cancel/close button — intentionally omitted */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(20),
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: hp(20),
    paddingVertical: hp(36),
    paddingHorizontal: wp(28),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconCircle: {
    width: hp(72),
    height: hp(72),
    borderRadius: hp(36),
    backgroundColor: COLORS.cinderella,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(20),
  },
  iconText: {
    fontSize: hp(32),
  },
  title: {
    fontSize: hp(22),
    fontFamily: FONTS.BOLD,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: hp(12),
    fontWeight: '700',
  },
  subtitle: {
    fontSize: hp(16),
    fontFamily: FONTS.REGULAR,
    color: '#666',
    textAlign: 'center',
    lineHeight: hp(24),
    marginBottom: hp(32),
    fontWeight: '500',
  },
  btn: {
    backgroundColor: COLORS.orange,
    borderRadius: hp(15),
    height: hp(50),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    fontSize: hp(16),
    fontFamily: FONTS.BOLD,
    color: COLORS.white,
    fontWeight: '700',
  },
});
