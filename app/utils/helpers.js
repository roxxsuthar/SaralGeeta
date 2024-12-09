import config from 'react-native-config';
export default class Helpers {
  static getUrl(apiPath) {
    return `${config.API_URL}${apiPath}`;
  }
}
console.log(config.API_URL);
