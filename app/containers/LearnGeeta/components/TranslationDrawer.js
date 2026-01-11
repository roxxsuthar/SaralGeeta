import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import { FONTS, IMAGES } from '../../../constants';
import CustomText from '../../../components/CustomText';
import styles from '../styles';
import { COLOR_ARRAY } from '../../../constants/constants';
import { hp } from '../../../utils/responsive';

const TranslationDrawer = ({
  visible,
  onClose,
  translationContent,
  currentLanguage,
  commentary,
  shloke,
  chapterDetail,
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
      supportedOrientations={['portrait', 'landscape']}
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
              {currentLanguage === 'en' ? 'Detail' : 'विवरण'}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IMAGES.CloseIcon height={24} width={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.drawerContent}
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
                    {idx === 3 && '||'}
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
      </View>
    </Modal>
  );
};

TranslationDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  translationContent: PropTypes.string,
  commentary: PropTypes.object,
  shloke: PropTypes.string,
  chapterDetail: PropTypes.object,
  currentLanguage: PropTypes.string.isRequired,
};

export default TranslationDrawer;
