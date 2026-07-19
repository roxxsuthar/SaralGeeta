// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

import en from './translations/en.json';
import hi from './translations/hi.json';
import ta from './translations/ta.json';
import mr from './translations/mr.json';
import kn from './translations/kn.json';
import gu from './translations/gu.json';
import or from './translations/or.json';
import bn from './translations/bn.json';

const strings = new LocalizedStrings({
  en,
  hi,
  ta,
  mr,
  kn,
  gu,
  or,
  bn,
});

export default strings;
