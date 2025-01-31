/** * *
OurIdeals
* */

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import isEqual from 'lodash/isEqual';

import { createStructuredSelector } from 'reselect';
import { makeSelectAppLanguage, makeSelectUser } from '../App/selectors';
import { compose } from 'redux';
import makeSelectOurIdeals from './selectors';
import styles from './styles';
import FastImage from 'react-native-fast-image';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import CustomButton from '../../components/CustomButton';
import strings from '../../../i18n';
import { Navigation } from '../../constants/constants';
import { getIdealsData } from './actions';
import { selectIdeal, updateUserDetails } from '../App/actions';
import LoadingScreen from '../../components/LoadingScreen';

function OurIdeals({
  navigation,
  language,
  getOurIdealsHandler,
  selectIdealHandler,
  ourIdeals,
  handleUpdateUser,
  user,
}) {
  const { OurIdeals: OurIdealsMessage } = strings;
  const { currentLanguage } = language;
  const [selectCard, setSelectCard] = useState(null);

  useEffect(() => {
    getOurIdealsHandler();
  }, []);

  const getStyleOfCard = useCallback(
    (item) => {
      if (isEqual(selectCard?.uuid, item?.uuid)) {
        return styles.boarderCardContainer;
      }
      return styles.cardContainer;
    },
    [selectCard],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={getStyleOfCard(item)}
        onPress={() => setSelectCard(item)}
        activeOpacity={0.8}
      >
        <FastImage
          style={styles.cardImage}
          source={{ uri: item?.image }}
          resizeMode={FastImage.resizeMode.contain}
          // onLoad={}
        />

        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.cardText,
          )}
        >
          {item?.name}
        </CustomText>
        <View style={styles.cardIconContainer}>
          <FastImage
            style={styles.cardIcon}
            source={{ uri: item?.avatar }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      </TouchableOpacity>
    ),
    [currentLanguage, getStyleOfCard, setSelectCard],
  );

  const itemSeparatorComponent = useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );

  const navigateToHome = useCallback(() => {
    selectIdealHandler(selectCard);
    const payload = {
      data: { ideal: selectCard?.uuid },
      userId: user?.uuid,
    };
    handleUpdateUser(payload);
    navigation.navigate(Navigation.Home);
  }, [selectCard, user]);

  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover" // Similar to background-size in CSS
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
        {ourIdeals?.loading ? (
          <LoadingScreen />
        ) : (
          <View style={styles.flatListContainer}>
            <FlatList
              data={ourIdeals?.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.uuid}
              ItemSeparatorComponent={itemSeparatorComponent}
            />
          </View>
        )}
        <CustomButton
          title={OurIdealsMessage.buttonLabel.defaultMessage}
          labelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.buttonLabel,
          )}
          style={styles.buttonContainer}
          onPress={navigateToHome}
        />
      </View>
    </ImageBackground>
  );
}

OurIdeals.propTypes = {
  language: PropTypes.object,
  navigation: PropTypes.object,
  ourIdeals: PropTypes.object,
  user: PropTypes.object,
  getOurIdealsHandler: PropTypes.func,
  selectIdealHandler: PropTypes.func,
  handleUpdateUser: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  ourIdeals: makeSelectOurIdeals(),
  language: makeSelectAppLanguage(),
  user: makeSelectUser(),
});

function mapDispatchToProps(dispatch) {
  return {
    getOurIdealsHandler: () => dispatch(getIdealsData()),
    selectIdealHandler: (payload) => dispatch(selectIdeal(payload)),
    handleUpdateUser: (payload) => dispatch(updateUserDetails(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OurIdeals);
