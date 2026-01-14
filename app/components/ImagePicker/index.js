/**
 *
 * ImagePicker
 *
 */

import React, { useState, memo, useMemo, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import PropTypes from 'prop-types';
import styles from './styles';

const DEFAULT_IMAGE = 'https://www.w3schools.com/howto/img_avatar.png'; // or your local asset

const ImagePicker = ({ onImageSelected, image }) => {
  const [imageUri, setImageUri] = useState(image);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setImageUri(image);
  }, [image]);

  const source = useMemo(
    () => ({ uri: imageUri || DEFAULT_IMAGE }),
    [imageUri],
  );

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;
    let result = await check(permission);
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      result = await request(permission);
    }

    // On iOS, if user denied, show alert to go to settings
    if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access in Settings to take photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              }
            },
          },
        ],
      );
      return false;
    }

    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
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

    // On iOS, if user denied, show alert to go to settings
    if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
      Alert.alert(
        'Photo Library Permission Required',
        'Please enable photo library access in Settings to select photos.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              }
            },
          },
        ],
      );
      return false;
    }

    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
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
    const options = {
      mediaType: 'photo',
      saveToPhotos: true,
      quality: 1,
      includeBase64: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Camera Error',
          response.errorMessage ||
            'Unable to access camera. Please check permissions in Settings.',
        );
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        onImageSelected && onImageSelected(response.assets[0]);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Gallery Error',
          response.errorMessage ||
            'Unable to access photo library. Please check permissions in Settings.',
        );
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
      <TouchableOpacity
        onPress={handleSelectImage}
        testID="image-picker-touchable"
        disabled={isLoading}
      >
        <Image
          key={source.uri}
          source={source}
          style={styles.avatar}
          testID="image-picker-image"
          onLoadStart={() => {
            const isRemote = imageUri && (imageUri.startsWith('http') || imageUri.startsWith('https'));
            if (isRemote && imageUri !== DEFAULT_IMAGE) {
              setIsLoading(true);
            }
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
        {isLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ffa600ff" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

ImagePicker.propTypes = {
  onImageSelected: PropTypes.func,
  image: PropTypes.string,
};

export default memo(ImagePicker);
