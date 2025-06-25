/**
 *
 * ImagePicker
 *
 */

import React, { useState, memo } from 'react';
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import PropTypes from 'prop-types';
import styles from './styles';

const DEFAULT_IMAGE = 'https://www.w3schools.com/howto/img_avatar.png'; // or your local asset

const ImagePicker = ({ onImageSelected, image }) => {
  const [imageUri, setImageUri] = useState(image);

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    let result = await check(permission);
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      result = await request(permission);
    }
    return result === RESULTS.GRANTED;
  };

  const requestGalleryPermission = async () => {
    let permission;
    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        permission = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }
    let result = await check(permission);
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      result = await request(permission);
    }
    return result === RESULTS.GRANTED;
  };

  const handleSelectImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const granted = await requestCameraPermission();
            if (granted) openCamera();
            else
              Alert.alert(
                'Permission Denied',
                'Camera permission is required.',
              );
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const granted = await requestGalleryPermission();
            if (granted) openGallery();
            else
              Alert.alert(
                'Permission Denied',
                'Gallery permission is required.',
              );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Camera error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        onImageSelected && onImageSelected(response.assets[0]);
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Gallery error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        onImageSelected && onImageSelected(response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage}>
        <Image
          source={{ uri: imageUri || DEFAULT_IMAGE }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    </View>
  );
};

ImagePicker.propTypes = {
  onImageSelected: PropTypes.string,
};

export default memo(ImagePicker);
