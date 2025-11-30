import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import { IMAGES } from '../../../constants';
import CustomText from '../../../components/CustomText';
import styles from '../styles';

const TranslationDrawer = ({
  visible,
  onClose,
  translationContent,
  currentLanguage,
}) => {
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.drawerOverlay}>
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
              {currentLanguage === 'en' ? 'Translation' : 'अनुवाद'}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IMAGES.CloseIcon height={24} width={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.drawerContent}
            showsVerticalScrollIndicator={false}
          >
            <CustomText style={styles.translationContent}>
              {translationContent || 'No translation available'}
            </CustomText>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

TranslationDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  translationContent: PropTypes.string,
  currentLanguage: PropTypes.string.isRequired,
};

export default TranslationDrawer;
