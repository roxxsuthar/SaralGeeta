/** * *
OurIdeals
* */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, FlatList } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { makeSelectAppLanguage } from '../App/selectors';
import { compose } from 'redux';
import makeSelectOurIdeals from './selectors';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import CustomButton from '../../components/CustomButton';
import strings from '../../../i18n';
import { Navigation } from '../../constants/constants';

function OurIdeals({ navigation, language }) {
  const { OurIdeals: OurIdealsMessage } = strings;
  const { currentLanguage } = language;

  const idealsData = [
    {
      id: 1,
      image: 'https://picsum.photos/700',
      icon: 'https://picsum.photos/700',
      text: 'Bhagwan Krishna',
    },
    {
      id: 2,
      image: 'https://picsum.photos/700',
      icon: 'https://picsum.photos/700',
      text: 'Vedavyasa',
    },
    {
      id: 3,
      image: 'https://picsum.photos/700',
      icon: 'https://picsum.photos/700',
      text: 'Bhagwan Ganesh',
    },
  ];

  const renderItem = useCallback((item) => {
    return (
      <View style={styles.cardContainer}>
        <FastImage
          style={styles.cardImage}
          source={{ uri: item?.image }}
          resizeMode={FastImage.resizeMode.contain}
        />

        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.cardText,
          )}
        >
          {item?.text}
        </CustomText>
        <View style={styles.cardIconContainer}>
          <FastImage
            style={styles.cardIcon}
            source={{ uri: item?.icon }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </View>
    );
  }, []);

  const itemSeparatorComponent = useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );

  const navigateToHome = useCallback(() => {
    navigation.navigate(Navigation.Home);
  }, []);

  return (
    <LinearGradient
      colors={['rgb(227,126,93)', 'rgb(242,206,88)']}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <FastImage
        style={styles.chakraStyle}
        source={IMAGES.Chakra}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.mainContainer}>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.heading,
          )}
        >
          Our Ideals
        </CustomText>
        <View style={styles.flatListContainer}>
          <FlatList
            data={idealsData}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={itemSeparatorComponent}
          />
        </View>
        <CustomButton
          title={OurIdealsMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={() => navigateToHome()}
        />
      </View>
    </LinearGradient>
  );
}

OurIdeals.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  ourIdeals: makeSelectOurIdeals(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OurIdeals);
