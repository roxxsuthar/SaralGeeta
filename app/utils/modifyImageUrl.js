import isEqual from 'lodash/isEqual';
import split from 'lodash/split';

import { CONSTANTS } from '../constants';

const modifyUrl = (imageUrl) => {
  const url =
    imageUrl &&
    isEqual(typeof imageUrl, 'string') &&
    !split(imageUrl, CONSTANTS.httpString)[1]
      ? null
      : imageUrl;
  return url;
};

export { modifyUrl };
