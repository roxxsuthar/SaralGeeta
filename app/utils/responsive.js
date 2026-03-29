import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scalingFactor = SCREEN_WIDTH > 600 ? 0.75 : 1;

const wp = value => {
  const convertedValue = (value * 100) / 375;
  const result = widthPercentageToDP(convertedValue);
  return SCREEN_WIDTH > 600 ? result * scalingFactor : result;
};

const hp = value => {
  const convertedValue = (value * 100) / 812;
  const result = heightPercentageToDP(convertedValue);
  return SCREEN_WIDTH > 600 ? result * scalingFactor : result;
};

export { wp, hp };
