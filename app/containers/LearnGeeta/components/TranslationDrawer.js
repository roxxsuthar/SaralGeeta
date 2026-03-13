import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  NativeModules,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import PropTypes from 'prop-types';
import { FONTS, IMAGES } from '../../../constants';
import CustomText from '../../../components/CustomText';
import styles from '../styles';
import { COLOR_ARRAY } from '../../../constants/constants';
import { hp } from '../../../utils/responsive';

const { OrientationModule } = NativeModules;

const TranslationDrawer = ({
  visible,
  onClose,
  translationContent,
  currentLanguage,
  commentary,
  shloke,
  shlokNo,
  chapterDetail,
}) => {
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current; // Add this
  const [isReady, setIsReady] = useState(false); // Add this

  useEffect(() => {
    if (visible) {
      // Lock orientation immediately
      if (Platform.OS === 'ios') {
        OrientationModule.lockToLandscape();
      } else {
        Orientation.lockToLandscape();
      }

      // Wait for orientation to stabilize
      setTimeout(() => {
        setIsReady(true);

        // Start animations together
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 150); // Increased delay
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsReady(false);
      });
    }
  }, [visible, slideAnim, opacityAnim]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
      presentationStyle="overFullScreen"
      onShow={() => {
        if (Platform.OS === 'ios') {
          OrientationModule.lockToLandscape();
        } else {
          Orientation.lockToLandscape();
        }
      }}
    >
      <Animated.View
        style={[
          styles.drawerOverlay,
          { opacity: opacityAnim } // Add fade to entire overlay
        ]}
      >
        <TouchableOpacity
          style={styles.drawerBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <CustomText style={styles.drawerTitle}>
              {currentLanguage === 'en' ? 'Detail' : 'विवरण'}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IMAGES.CloseIcon height={24} width={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.drawerContent}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {chapterDetail?.name && (
              <CustomText style={styles.chapterName}>
                {chapterDetail?.name || ''}{' '}
                {currentLanguage === 'en'
                  ? `(Chapter ${chapterDetail?.serial})`
                  : `(अध्याय ${chapterDetail?.serial})`}
              </CustomText>
            )}
            {commentary?.name && (
              <CustomText style={styles.commentory}>
                {commentary?.name || ''}
              </CustomText>
            )}

            <CustomText style={{ textAlign: 'center', lineHeight: hp(35) }}>
              {shloke?.map((item, idx) => (
                <React.Fragment key={idx}>
                  <CustomText
                    style={{
                      fontSize: hp(16),
                      fontFamily: FONTS.HINDI,
                      fontWeight: '400',
                      color: COLOR_ARRAY[idx],
                    }}
                  >
                    {item}
                    {idx === 3 && ` || ${shlokNo || ''} ||`}
                  </CustomText>
                  {idx < 3 && (idx === 1 ? '\n' : ' ')}
                </React.Fragment>
              ))}
            </CustomText>
            <CustomText style={styles.text}>
              {currentLanguage === 'en' ? 'Translation' : 'अनुवाद'}
            </CustomText>
            <CustomText style={styles.translationContent}>
              {translationContent || 'No translation available'}
            </CustomText>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

TranslationDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  translationContent: PropTypes.string,
  commentary: PropTypes.object,
  shloke: PropTypes.array,
  shlokNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chapterDetail: PropTypes.object,
  currentLanguage: PropTypes.string.isRequired,
};

export default TranslationDrawer;