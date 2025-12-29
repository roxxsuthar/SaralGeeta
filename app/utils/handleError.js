import Snackbar from 'react-native-snackbar';

const handleError = (err, time = 500) => {
  Snackbar.dismiss();
  let timer = null;

  timer = setTimeout(() => {
    Snackbar.show({
      text:
        err?.response?.data?.message ||
        err?.message ||
        err?.error ||
        'Something went wrong!',
      duration: Snackbar.LENGTH_LONG,
      action: {
        text: 'CANCEL',
      },
      numberOfLines: 10,
    });

    clearTimeout(timer);
  }, time);
};
export default handleError;
