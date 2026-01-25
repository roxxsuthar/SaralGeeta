import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import ImagePicker from '../index';

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

// Mock react-native-permissions
jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: {
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
    },
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    LIMITED: 'limited',
  },
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  Version: 30,
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('ImagePicker', () => {
  const defaultProps = {
    onImageSelected: jest.fn(),
    image: 'https://example.com/test-image.jpg',
  };

  const mockImageResponse = {
    didCancel: false,
    errorCode: undefined,
    errorMessage: undefined,
    assets: [
      {
        uri: 'https://example.com/selected-image.jpg',
        fileName: 'test.jpg',
        type: 'image/jpeg',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    Platform.Version = 30;
  });

  it('renders with default image when no image prop is provided', () => {
    const { getByTestId } = render(<ImagePicker onImageSelected={jest.fn()} />);
    const image = getByTestId('image-picker-image');
    expect(image.props.source.uri).toBe(
      'https://www.w3schools.com/howto/img_avatar.png',
    );
  });

  it('renders with provided image prop', () => {
    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const image = getByTestId('image-picker-image');
    expect(image.props.source.uri).toBe(defaultProps.image);
  });

  it('shows alert when image picker is pressed', () => {
    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Select Image',
      'Choose an option',
      expect.any(Array),
      { cancelable: true },
    );
  });

  it('handles camera permission request on iOS', async () => {
    const { check, request } = require('react-native-permissions');
    const { PERMISSIONS, RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(check).toHaveBeenCalledWith(PERMISSIONS.IOS.CAMERA);
    expect(request).toHaveBeenCalledWith(PERMISSIONS.IOS.CAMERA);
  });

  it('handles camera permission request on Android', async () => {
    Platform.OS = 'android';
    const { check, request } = require('react-native-permissions');
    const { PERMISSIONS, RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(check).toHaveBeenCalledWith(PERMISSIONS.ANDROID.CAMERA);
    expect(request).toHaveBeenCalledWith(PERMISSIONS.ANDROID.CAMERA);
  });

  it('handles gallery permission request on iOS', async () => {
    const { check, request } = require('react-native-permissions');
    const { PERMISSIONS, RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(check).toHaveBeenCalledWith(PERMISSIONS.IOS.PHOTO_LIBRARY);
    expect(request).toHaveBeenCalledWith(PERMISSIONS.IOS.PHOTO_LIBRARY);
  });

  it('handles gallery permission request on Android API 33+', async () => {
    Platform.OS = 'android';
    Platform.Version = 33;
    const { check, request } = require('react-native-permissions');

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    const result = await galleryOption.onPress();

    // Should NOT call check or request on API 33+
    expect(check).not.toHaveBeenCalled();
    expect(request).not.toHaveBeenCalled();
    // But it should return true or proceed to open gallery
  });

  it('handles gallery permission request on Android API < 33', async () => {
    Platform.OS = 'android';
    Platform.Version = 30;
    const { check, request } = require('react-native-permissions');
    const { PERMISSIONS, RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.GRANTED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(check).toHaveBeenCalledWith(
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );
    expect(request).toHaveBeenCalledWith(
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );
  });

  it('shows permission denied alert when camera permission is denied', async () => {
    const { check, request } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.DENIED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Permission Denied',
      'Camera permission is required.',
    );
  });

  it('shows permission denied alert when gallery permission is denied', async () => {
    const { check, request } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');

    check.mockResolvedValue(RESULTS.DENIED);
    request.mockResolvedValue(RESULTS.DENIED);

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Permission Denied',
      'Gallery permission is required.',
    );
  });

  it('opens camera when permission is granted', async () => {
    const { check, request } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchCamera } = require('react-native-image-picker');

    check.mockResolvedValue(RESULTS.GRANTED);
    launchCamera.mockImplementation((options, callback) => {
      callback(mockImageResponse);
    });

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(launchCamera).toHaveBeenCalledWith(
      { mediaType: 'photo', saveToPhotos: true },
      expect.any(Function),
    );
  });

  it('opens gallery when permission is granted', async () => {
    const { check, request } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchImageLibrary } = require('react-native-image-picker');

    check.mockResolvedValue(RESULTS.GRANTED);
    launchImageLibrary.mockImplementation((options, callback) => {
      callback(mockImageResponse);
    });

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(launchImageLibrary).toHaveBeenCalledWith(
      { mediaType: 'photo' },
      expect.any(Function),
    );
  });

  it('calls onImageSelected callback when image is selected from camera', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchCamera } = require('react-native-image-picker');
    const onImageSelected = jest.fn();

    check.mockResolvedValue(RESULTS.GRANTED);
    launchCamera.mockImplementation((options, callback) => {
      callback(mockImageResponse);
    });

    const { getByTestId } = render(
      <ImagePicker onImageSelected={onImageSelected} />,
    );
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(onImageSelected).toHaveBeenCalledWith(mockImageResponse.assets[0]);
  });

  it('calls onImageSelected callback when image is selected from gallery', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchImageLibrary } = require('react-native-image-picker');
    const onImageSelected = jest.fn();

    check.mockResolvedValue(RESULTS.GRANTED);
    launchImageLibrary.mockImplementation((options, callback) => {
      callback(mockImageResponse);
    });

    const { getByTestId } = render(
      <ImagePicker onImageSelected={onImageSelected} />,
    );
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(onImageSelected).toHaveBeenCalledWith(mockImageResponse.assets[0]);
  });

  it('handles camera error gracefully', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchCamera } = require('react-native-image-picker');

    check.mockResolvedValue(RESULTS.GRANTED);
    launchCamera.mockImplementation((options, callback) => {
      callback({
        didCancel: false,
        errorCode: 'CAMERA_ERROR',
        errorMessage: 'Camera failed to open',
      });
    });

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Camera error',
      'Camera failed to open',
    );
  });

  it('handles gallery error gracefully', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchImageLibrary } = require('react-native-image-picker');

    check.mockResolvedValue(RESULTS.GRANTED);
    launchImageLibrary.mockImplementation((options, callback) => {
      callback({
        didCancel: false,
        errorCode: 'GALLERY_ERROR',
        errorMessage: 'Gallery failed to open',
      });
    });

    const { getByTestId } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      'Gallery error',
      'Gallery failed to open',
    );
  });

  it('does not call onImageSelected when camera is cancelled', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchCamera } = require('react-native-image-picker');
    const onImageSelected = jest.fn();

    check.mockResolvedValue(RESULTS.GRANTED);
    launchCamera.mockImplementation((options, callback) => {
      callback({ didCancel: true });
    });

    const { getByTestId } = render(
      <ImagePicker onImageSelected={onImageSelected} />,
    );
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    expect(onImageSelected).not.toHaveBeenCalled();
  });

  it('does not call onImageSelected when gallery is cancelled', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchImageLibrary } = require('react-native-image-picker');
    const onImageSelected = jest.fn();

    check.mockResolvedValue(RESULTS.GRANTED);
    launchImageLibrary.mockImplementation((options, callback) => {
      callback({ didCancel: true });
    });

    const { getByTestId } = render(
      <ImagePicker onImageSelected={onImageSelected} />,
    );
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate gallery selection
    const alertCall = Alert.alert.mock.calls[0];
    const galleryOption = alertCall[2].find(
      (option) => option.text === 'Gallery',
    );
    await galleryOption.onPress();

    expect(onImageSelected).not.toHaveBeenCalled();
  });

  it('updates image URI when new image is selected', async () => {
    const { check } = require('react-native-permissions');
    const { RESULTS } = require('react-native-permissions');
    const { launchCamera } = require('react-native-image-picker');

    check.mockResolvedValue(RESULTS.GRANTED);
    launchCamera.mockImplementation((options, callback) => {
      callback(mockImageResponse);
    });

    const { getByTestId, rerender } = render(<ImagePicker {...defaultProps} />);
    const touchable = getByTestId('image-picker-touchable');

    fireEvent.press(touchable);

    // Simulate camera selection
    const alertCall = Alert.alert.mock.calls[0];
    const cameraOption = alertCall[2].find(
      (option) => option.text === 'Camera',
    );
    await cameraOption.onPress();

    // Re-render to see the updated state
    rerender(<ImagePicker {...defaultProps} />);
    const updatedImage = getByTestId('image-picker-image');

    expect(updatedImage.props.source.uri).toBe(mockImageResponse.assets[0].uri);
  });
});
