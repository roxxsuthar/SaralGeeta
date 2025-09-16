import React from 'react';
import { render } from '@testing-library/react-native';
import FastImageLoading from '../index';

// Mock react-native-fast-image
jest.mock('react-native-fast-image', () => {
  function FastImage() {
    return 'FastImage';
  }
  FastImage.resizeMode = {
    cover: 'cover',
    contain: 'contain',
    stretch: 'stretch',
    center: 'center',
  };
  FastImage.priority = {
    high: 'high',
    normal: 'normal',
    low: 'low',
  };
  return FastImage;
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

// Mock react-native-responsive-screen
jest.mock('react-native-responsive-screen', () => ({
  heightPercentageToDP: jest.fn(() => 30),
}));

// Mock the constants
jest.mock('../../../constants', () => ({
  COLORS: {
    emoRed: '#FF0000',
  },
}));

// Mock the utils
jest.mock('../../../utils/modifyImageUrl', () => ({
  modifyUrl: jest.fn((url) => url),
}));

describe('FastImageLoading', () => {
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    styles: { width: 100, height: 100 },
  };

  it('renders with default props', () => {
    const { toJSON } = render(<FastImageLoading {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom indicator size', () => {
    const { toJSON } = render(
      <FastImageLoading {...defaultProps} indicatorSize="large" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom icon size', () => {
    const { toJSON } = render(
      <FastImageLoading {...defaultProps} iconSize={24} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom resize mode', () => {
    const { toJSON } = render(
      <FastImageLoading {...defaultProps} resizeMode="contain" />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with local image flag', () => {
    const { toJSON } = render(
      <FastImageLoading {...defaultProps} isLocal={true} />,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(
        <FastImageLoading {...defaultProps}>
          <div>Child Content</div>
        </FastImageLoading>,
      );
    }).not.toThrow();
  });
});
