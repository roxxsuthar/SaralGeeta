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
import { CommonActions } from '@react-navigation/native';
import isEqual from 'lodash/isEqual';

import { createStructuredSelector } from 'reselect';
import { makeSelectAppLanguage, makeSelectUser } from '../App/selectors';
import { compose } from 'redux';
import makeSelectOurIdeals from './selectors';
import styles from './styles';
import FastImageLoading from '../../components/FastImageLoading';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import CustomButton from '../../components/CustomButton';
import strings from '../../../i18n';
import { Navigation } from '../../constants/constants';
import { getIdealsData } from './actions';
import { selectIdeal, updateUserDetails } from '../App/actions';
import LoadingScreen from '../../components/LoadingScreen';
import { SafeAreaView } from 'react-native';

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
  const [disableBtn, setDisableBtn] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await getOurIdealsHandler();
    };
    fetchData();
  }, []);

  const getStyleOfCard = useCallback(
    (item) => {
      if (isEqual(selectCard?.id, item?.id)) {
        return styles.boarderCardContainer;
      }
      return styles.cardContainer;
    },
    [selectCard],
  );

  const selectItem = useCallback((item) => {
    setSelectCard(item);
    setDisableBtn(false);
  });

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={getStyleOfCard(item)}
        onPress={() => selectItem(item)}
        activeOpacity={0.8}
      >
        <FastImageLoading
          styles={styles.cardImage}
          imageUrl={item?.image}
          resizeMode="contain"
          indicatorColor="#ffa600ff"
        />

        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.cardText,
          )}
        >
          {item?.name}
        </CustomText>
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
      data: { ideal_id: selectCard?.id },
    };
    handleUpdateUser(payload);

    // Clear navigation stack and navigate to Home
    // This makes Home the root screen, preventing back navigation to OurIdeals
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Drawer',
            state: {
              routes: [
                {
                  name: 'HomeStack',
                  state: {
                    routes: [{ name: Navigation.Home }],
                  },
                },
              ],
            },
          },
        ],
      }),
    );
  }, [selectCard, user, navigation]);

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
      <FastImageLoading
        styles={styles.chakraStyle}
        imageUrl={IMAGES.Chakra}
        resizeMode="contain"
        isLocal={true}
        indicatorColor="#ffa600ff"
      />
      <SafeAreaView style={styles.mainContainer}>
        <CustomText
          style={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.heading,
          )}
        >
          {OurIdealsMessage.ourIdeals.defaultMessage}
        </CustomText>
        {ourIdeals?.loading ? (
          <LoadingScreen />
        ) : (
          <View style={styles.flatListContainer}>
            <FlatList
              data={ourIdeals?.data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
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
          disabledStyle={styles.disabledButtonContainer}
          disabledLabelStyle={Object.assign(
            setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
            styles.disableButtonLabel,
          )}
          onPress={navigateToHome}
          disabled={disableBtn}
        />
      </SafeAreaView>
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
