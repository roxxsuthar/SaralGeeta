import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../';

// Mock styles and IMAGES to avoid import errors
jest.mock('../styles', () => ({
  defaultContainer: {},
  disabledContainerStyle: {},
  defaultButtonText: {},
  disabledButtonText: {},
  textIconContainer: {},
  previousNavigateIcon: {},
  nextNavigateIcon: {},
}));
jest.mock('../../../constants', () => ({
  IMAGES: {
    BackIcon: (props) => <svg data-testid="back-icon" {...props} />,
    NavigateNext: (props) => <svg data-testid="next-icon" {...props} />,
  },
}));

describe('CustomButton', () => {
  it('renders the button with the correct title', () => {
    const { getByText } = render(<CustomButton title="Press Me" />);
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('fires onPress when pressed and not disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click" onPress={onPressMock} />,
    );
    fireEvent.press(getByText('Click'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Disabled" onPress={onPressMock} disabled />,
    );
    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders previousNavigateIcon when previousNavigateIcon is true', () => {
    const { getByTestId } = render(
      <CustomButton title="Prev" previousNavigateIcon={true} />,
    );
    expect(getByTestId('back-icon')).toBeTruthy();
  });

  it('renders nextNavigateIcon when nextNavigateIcon is true', () => {
    const { getByTestId } = render(
      <CustomButton title="Next" nextNavigateIcon={true} />,
    );
    expect(getByTestId('next-icon')).toBeTruthy();
  });

  it('renders default title if no title prop is supplied', () => {
    const { getByText } = render(<CustomButton />);
    expect(getByText('Demo Text')).toBeTruthy();
  });
});
