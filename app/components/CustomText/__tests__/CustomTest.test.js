import React from 'react';
import { render } from '@testing-library/react-native';
import CustomText from '../';

describe('CustomText', () => {
  it('renders string children', () => {
    const { getByText } = render(<CustomText>Sample Text</CustomText>);
    expect(getByText('Sample Text')).toBeTruthy();
  });

  it('renders number children', () => {
    const { getByText } = render(<CustomText>{123}</CustomText>);
    expect(getByText('123')).toBeTruthy();
  });

  it('applies custom style', () => {
    const style = { color: 'red', fontSize: 22 };
    const { getByText } = render(<CustomText style={style}>Styled</CustomText>);
    expect(getByText('Styled').props.style).toMatchObject(style);
  });

  it('limits number of lines when numberOfLines is passed', () => {
    const { getByText } = render(
      <CustomText numberOfLines={1}>Multiline Text</CustomText>,
    );
    expect(getByText('Multiline Text').props.numberOfLines).toBe(1);
  });

  it('supports additional props', () => {
    const { getByText } = render(
      <CustomText testID="myText">Prop test</CustomText>,
    );
    expect(getByText('Prop test').props.testID).toBe('myText');
  });
});
