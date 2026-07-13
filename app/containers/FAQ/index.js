/** * *
FAQ
* */

import React, { memo, useState, useRef } from 'react';
import {
  View,
  StatusBar,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import strings from '../../../i18n';
import styles from './styles';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  { key: 'q1' },
  { key: 'q2' },
  { key: 'q3' },
  { key: 'q4' },
  { key: 'q5' },
  { key: 'q6' },
  { key: 'q7' },
  { key: 'q8' },
  { key: 'q9' },
  { key: 'q10' },
  { key: 'q11' },
  { key: 'q12' },
];

const FAQItem = ({ question, answer, index }) => {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleItem = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });

    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={toggleItem}
      style={[styles.faqItem, expanded && styles.faqItemExpanded]}
    >
      <View style={styles.questionRow}>
        <View style={styles.indexBadge}>
          <CustomText style={styles.indexText}>{index}</CustomText>
        </View>
        <CustomText style={styles.questionText}>{question}</CustomText>
        <Animated.View style={[styles.chevronWrapper, { transform: [{ rotate }] }]}>
          <IMAGES.ChevronDown height="100%" width="100%" />
        </Animated.View>
      </View>
      {expanded && (
        <View style={styles.answerContainer}>
          <View style={styles.divider} />
          <CustomText style={styles.answerText}>{answer}</CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

function FAQ() {
  const { faq: faqStrings } = strings;
  const navigation = useNavigation();

  const faqs = FAQ_DATA.map((item) => ({
    key: item.key,
    question: faqStrings[`${item.key}_question`]?.defaultMessage || '',
    answer: faqStrings[`${item.key}_answer`]?.defaultMessage || '',
  }));

  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}
          >
            <View style={styles.icon}>
              <IMAGES.WhiteArrowIcon height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
            {faqStrings.heading?.defaultMessage}
          </CustomText>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.mainContainer}>
          <CustomText style={styles.subHeading}>
            {faqStrings.subHeading?.defaultMessage}
          </CustomText>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {faqs.map((item, idx) => (
              <FAQItem
                key={item.key}
                index={idx + 1}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default memo(FAQ);
