// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

import en from './translations/en.json';
import hi from './translations/hi.json';

const strings = new LocalizedStrings({
  en,
  hi,
});

export default strings;
