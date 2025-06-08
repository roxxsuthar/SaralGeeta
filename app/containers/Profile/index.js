/** * *
Profile
* */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';
import strings from '../../../i18n';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectProfile from './selectors';
import styles from './styles';
import { IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';
import CustomText from '../../components/CustomText';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  makeSelectAppLanguage,
  makeSelectIdealDetails,
  makeSelectUser,
} from '../App/selectors';

function Profile({ user, ideal }) {
  const { Profile: profileMessage } = strings;
  const navigation = useNavigation();

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
      <View style="{styles.container}">
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View style={styles.icon}>
              <IMAGES.Bars height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading}>
            {profileMessage.heading.defaultMessage}
          </CustomText>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.userDetails}>
            <View style={styles.userData}>
              <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.name.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>
                  {user?.name || 'Guest'}
                </CustomText>
              </View>
              <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.email.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>
                  {user?.email || 'N/A'}
                </CustomText>
              </View>
              <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.mobile.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>
                  {' '}
                  {user?.phone || 'N/A'}
                </CustomText>
              </View>
              <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.gender.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>
                  {' '}
                  {user?.gender || 'N/A'}
                </CustomText>
              </View>
              <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.voice.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>
                  {ideal?.name || 'N/A'}
                </CustomText>
              </View>
              {/* <View>
                <CustomText style={styles.detailTitle}>
                  {profileMessage.shlokSpeed.defaultMessage}
                </CustomText>
                <CustomText style={styles.detailText}>1x</CustomText>
              </View> */}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <IMAGES.User style={styles.icon} />
                <CustomText style={styles.buttonText}>
                  {profileMessage.updateProfile.defaultMessage}
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <IMAGES.Lock
                  style={styles.icon}
                />
                 <CustomText style={styles.buttonText}>{profileMessage.changePassword.defaultMessage}</CustomText>
              </TouchableOpacity>
            </View> */}
          </View>
          {/* <ImageBackground
            source={IMAGES.AppBackground}
            style={styles.footerImage}
          >
            <View style={styles.footerContainer}>
              <Image
                source={IMAGES.Chakra}
                resizeMode="contain"
                style={styles.chakraImage}
              />
              <CustomText style={styles.footerText}>version 1.1.0</CustomText>
            </View>
          </ImageBackground> */}
        </View>
      </View>
    </ImageBackground>
  );
}

Profile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object,
  ideal: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  language: makeSelectAppLanguage(),
  user: makeSelectUser(),
  ideal: makeSelectIdealDetails(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Profile);
