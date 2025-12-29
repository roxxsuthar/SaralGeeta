import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

const wp = value => {
  const convertedValue = (value * 100) / 375;
  return widthPercentageToDP(convertedValue);
};

const hp = value => {
  const convertedValue = (value * 100) / 812;
  return heightPercentageToDP(convertedValue);
};

export {wp, hp};
