/** * *
OurIdeals
* */

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import isEqual from 'lodash/isEqual';

import { createStructuredSelector } from 'reselect';
import { makeSelectAppLanguage, makeSelectIdealDetails, makeSelectUser } from '../App/selectors';
import { compose } from 'redux';
import makeSelectOurIdeals from './selectors';
import styles from './styles';
import FastImageLoading from '../../components/FastImageLoading';
import { FONTS, IMAGES } from '../../constants';
import CustomText from '../../components/CustomText';
import { setFontFamily } from '../../utils/device';
import strings from '../../../i18n';
import { Navigation } from '../../constants/constants';
import { getIdealsData, saveIdealData } from './actions';
import { selectIdeal } from '../App/actions';
import LoadingScreen from '../../components/LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

function OurIdeals({
  navigation,
  language,
  getOurIdealsHandler,
  selectIdealHandler,
  ourIdeals,
  handleUpdateUser,
  user,
  selectIdealData
}) {
  const { OurIdeals: OurIdealsMessage } = strings;
  const { currentLanguage } = language;
  const [selectCard, setSelectCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getOurIdealsHandler();
    };
    fetchData();
  }, []);

  const onCardPress = useCallback(
    (item) => {
      setSelectCard(item);
      selectIdealHandler(item);

      const payload = {
        data: { ideal_id: item?.id },
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
    },
    [setSelectCard, selectIdealHandler, handleUpdateUser, navigation],
  );

  const selectItem = useCallback(
    (item) => {
      setSelectCard(item);
      selectIdealHandler(item);
    },
    [setSelectCard, selectIdealHandler],
  );

  useEffect(() => {
    if (user?.ideal && selectIdealData?.id) {
      selectItem(selectIdealData);
    }
  }, [user?.ideal, selectIdealData, selectItem]);

  const getStyleOfCard = useCallback(
    (item) => {
      if (isEqual(selectCard?.id, item?.id)) {
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
        onPress={() => onCardPress(item)}
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
    [currentLanguage, getStyleOfCard, onCardPress],
  );

  const itemSeparatorComponent = useCallback(
    () => <View style={styles.itemSeparator} />,
    [],
  );



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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          {typeof navigation.openDrawer === 'function' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.iconContainer}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <View style={styles.icon}>
                <IMAGES.Bars height="100%" width="100%" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconContainer} />
          )}
          <CustomText
            style={Object.assign(
              setFontFamily(currentLanguage, FONTS.REGULAR, FONTS.HINDI),
              styles.heading,
            )}
          >
            {OurIdealsMessage.ourIdeals.defaultMessage}
          </CustomText>
        </View>

        <View style={styles.mainContainer}>
          {ourIdeals?.loading ? (
            <LoadingScreen />
          ) : (
            <View style={styles.flatListContainer}>
              <FlashList
                data={ourIdeals?.data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={itemSeparatorComponent}
                showsVerticalScrollIndicator={false}
                estimatedItemSize={100}
              />
            </View>
          )}
        </View>
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
  selectIdealData: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  ourIdeals: makeSelectOurIdeals(),
  language: makeSelectAppLanguage(),
  user: makeSelectUser(),
  selectIdealData: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return {
    getOurIdealsHandler: () => dispatch(getIdealsData()),
    selectIdealHandler: (payload) => dispatch(selectIdeal(payload)),
    handleUpdateUser: (payload) => dispatch(saveIdealData(payload)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OurIdeals);
