import {hasNotch, isTablet} from 'react-native-device-info';
import {Platform} from 'react-native';
import isEqual from 'lodash/isEqual';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const isHavingNotch = hasNotch();
const _isTablet = isTablet();
const {OS} = Platform;

const marginBottom = (val = 0) => {
  if (isEqual(OS, 'ios') && isHavingNotch) {
    return 0;
  }
  return hp(val);
};

const marginTop = (val = 0) => {
  if (isEqual(OS, 'ios') && isHavingNotch) {
    return hp(val);
  }
  return 0;
};

export {isHavingNotch, OS, marginBottom, marginTop, _isTablet};
