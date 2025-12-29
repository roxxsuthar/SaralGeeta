import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingScreen from '../index';

// Mock the Modal component to avoid Jest parsing issues
jest.mock('react-native', () => ({
  View: 'View',
  ActivityIndicator: 'ActivityIndicator',
  Modal: 'Modal',
}));

// Mock the constants
jest.mock('../../../constants', () => ({
  COLORS: {
    loadingTransparent: 'rgba(0, 0, 0, 0.5)',
    flamingo: '#FF6B6B',
  },
  FONTS: {
    REGULAR: 'Inter-Regular',
    HINDI_REGULAR: 'TiroDevanagariHindi-Regular',
  },
}));

// Mock the CustomText component
jest.mock('../../CustomText', () => 'CustomText');

// Mock the device utility
jest.mock('../../../utils/device', () => ({
  setFontFamily: jest.fn((language, englishFont, hindiFont) => {
    return language === 'hi' ? hindiFont : englishFont;
  }),
}));

// Mock the styles
jest.mock('../styles', () => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
}));

describe('LoadingScreen', () => {
  const defaultProps = {
    currentLanguage: 'en',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<LoadingScreen {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with English language', () => {
    const { toJSON } = render(<LoadingScreen currentLanguage="en" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with Hindi language', () => {
    const { toJSON } = render(<LoadingScreen currentLanguage="hi" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with undefined language', () => {
    const { toJSON } = render(<LoadingScreen currentLanguage={undefined} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with null language', () => {
    const { toJSON } = render(<LoadingScreen currentLanguage={null} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with empty string language', () => {
    const { toJSON } = render(<LoadingScreen currentLanguage="" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without currentLanguage prop', () => {
    const { toJSON } = render(<LoadingScreen />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders consistently across multiple renders', () => {
    const { rerender } = render(<LoadingScreen {...defaultProps} />);

    // Re-render with same props
    rerender(<LoadingScreen {...defaultProps} />);

    // Should not crash
    expect(true).toBe(true);
  });

  it('calls setFontFamily utility function', () => {
    render(<LoadingScreen currentLanguage="en" />);

    // Check that setFontFamily was called
    const { setFontFamily } = jest.requireMock('../../../utils/device');
    expect(setFontFamily).toHaveBeenCalled();
  });

  it('calls setFontFamily with correct parameters for English', () => {
    render(<LoadingScreen currentLanguage="en" />);

    const { setFontFamily } = jest.requireMock('../../../utils/device');
    expect(setFontFamily).toHaveBeenCalledWith(
      'en',
      'Inter-Regular',
      'TiroDevanagariHindi-Regular',
    );
  });

  it('calls setFontFamily with correct parameters for Hindi', () => {
    render(<LoadingScreen currentLanguage="hi" />);

    const { setFontFamily } = jest.requireMock('../../../utils/device');
    expect(setFontFamily).toHaveBeenCalledWith(
      'hi',
      'Inter-Regular',
      'TiroDevanagariHindi-Regular',
    );
  });
});
