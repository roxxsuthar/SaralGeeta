/** * *
EditProfile
* */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ImageBackground, StatusBar } from 'react-native';
import { Slider } from 'react-native-elements';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectEditProfile from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';
import CustomText from '../../components/CustomText';
import { TextInput } from 'react-native-gesture-handler';
function EditProfile() {
  const [speed, setSpeed] = useState(1);
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
          <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
            <View style={styles.icon}>
              <IMAGES.ChevronLeftSolid height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading}>Profile</CustomText>
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Name</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Arjun"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Last Name</CustomText>
            <TextInput
              style={styles.input}
              placeholder="Wick"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Phone Number</CustomText>
            <TextInput
              style={styles.input}
              placeholder="
      +91 8573291111"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.black}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Gender</CustomText>
            <TextInput
              style={styles.input}
              placeholder="
      Male"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.black}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText style={styles.label}>Shlok Speed</CustomText>
            <CustomText style={styles.label}>{speed}x</CustomText>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              minimumValue={0.5}
              maximumValue={3}
              step={0.5}
              minimumTrackTintColor={COLORS.orange}
              maximumTrackTintColor={COLORS.white}
              thumbStyle={styles.thumb}
              trackStyle={styles.track}
            />
          </View>
          <View>
              <TouchableOpacity style={styles.button}>
              
                 <CustomText style={styles.buttonText}>Update</CustomText>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </ImageBackground>
  );
}

EditProfile.propTypes = { dispatch: PropTypes.func.isRequired };

const mapStateToProps = createStructuredSelector({
  editProfile: makeSelectEditProfile(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EditProfile);
