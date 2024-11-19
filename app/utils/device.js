import { hasNotch, isTablet } from 'react-native-device-info';
import { Platform } from 'react-native';
import isEqual from 'lodash/isEqual';
import { hp } from '../utils/responsive';
import { CONSTANTS } from '../constants';

const isHavingNotch = hasNotch();
const _isTablet = isTablet();
const { OS } = Platform;

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

const setFontFamily = (selectedLanguage, englishFont, hindiFont) => {
  if (isEqual(selectedLanguage, CONSTANTS.ENCode)) {
    return {
      fontFamily: englishFont,
    };
  }
  return {
    fontFamily: hindiFont,
  };
};

export { isHavingNotch, OS, marginBottom, marginTop, _isTablet, setFontFamily };
