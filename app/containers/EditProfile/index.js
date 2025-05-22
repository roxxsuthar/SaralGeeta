/** * *
EditProfile
* */

import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View, ImageBackground, StatusBar } from 'react-native';
// import { Slider } from 'react-native-elements';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectEditProfile from './selectors';
import styles from './styles';
import { COLORS, IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';
import CustomText from '../../components/CustomText';
import { TextInput } from 'react-native-gesture-handler';
import PhoneInput from 'react-native-phone-number-input';
import SelectInput from '../../components/SelectInput';
import strings from '../../../i18n';
import { makeSelectAppLanguage } from '../App/selectors';
import WithKeyboardAvoidingView from '../../utils/withKeyboardView';

function EditProfile() {
  const { EditProfile: EditProfileMessage } = strings;
  const [selectGender, setSelectedGender] = useState({
    label: 'Male',
    value: 'male',
  });
  // const [speed, setSpeed] = useState(1);
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const gender = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
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
      <WithKeyboardAvoidingView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.iconContainer}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.icon}>
                <IMAGES.ChevronLeftSolid height="100%" width="100%" />
              </View>
            </TouchableOpacity>
            <CustomText style={styles.heading}>
              {EditProfileMessage.heading.defaultMessage}
            </CustomText>
          </View>
          <View style={styles.mainContainer}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <CustomText style={styles.label}>
                  {EditProfileMessage.name.defaultMessage}
                </CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="first name"
                  placeholderTextColor={COLORS.black}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomText style={styles.label}>
                  {EditProfileMessage.lastName.defaultMessage}
                </CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="last name"
                  placeholderTextColor={COLORS.black}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomText style={styles.label}>
                  {EditProfileMessage.mobile.defaultMessage}
                </CustomText>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={phoneNumber}
                  defaultCode="IN"
                  layout="first"
                  onChangeFormattedText={(text) => {
                    setPhoneNumber(text);
                  }}
                  containerStyle={styles.phoneContainer}
                  textContainerStyle={styles.textInput}
                  textInputProps={{
                    placeholder: 'Phone number',
                    placeholderTextColor: COLORS.black,
                  }}
                />
              </View>

              <View style={styles.inputContainer}>
                <CustomText style={styles.label}>
                  {EditProfileMessage.gender.defaultMessage}
                </CustomText>
                <SelectInput
                  label="Select"
                  options={gender}
                  value={selectGender}
                  onSelect={(item) => setSelectedGender(item)}
                />
              </View>
              {/* <View style={styles.inputContainer}>
            <CustomText style={styles.label}>
              {EditProfileMessage.shlokSpeed.defaultMessage}
            </CustomText>
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
          </View> */}
            </View>
            <View>
              <TouchableOpacity style={styles.button}>
                <CustomText style={styles.buttonText}>
                  {EditProfileMessage.update.defaultMessage}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </WithKeyboardAvoidingView>
    </ImageBackground>
  );
}

EditProfile.propTypes = {};

const mapStateToProps = createStructuredSelector({
  editProfile: makeSelectEditProfile(),
  language: makeSelectAppLanguage(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(EditProfile);
