/* eslint-disable */

/*
 * ref = reference of the React element whose value will be updated every second (preferably TextInput)
 * time = countdown time
 * onStart = callback to be called before the countdown starts (e.g, for settting some varibles)
 * onFinish = callback to be called once the countdown ends.
 *
 * use `startCountdown` to start the countdown and if you want to stop the countdown before it ends (e.g. when the
 * component unmounts) just call `stopCountdown`
 */

import moment from 'moment';
import strings from '../../i18n';

let intervalID = null;

const startCountdown = (ref, time, onStart, onFinish) => {
  const interval = 1000;
  let timeout = moment.duration().add(time, 's');
  const { otpScreen: otpScreenMessage } = strings;

  const subtractSecond = () => {
    timeout = timeout.subtract(1, 's');
    const minutes = timeout.minutes();
    const seconds = timeout.seconds();
    if (minutes <= 0 && seconds <= 0) {
      ref.current?.setNativeProps({
        text: '',
      });
      clearInterval(intervalID);
      onFinish();
    } else if (minutes === 0 && seconds !== 0) {
      ref.current?.setNativeProps({
        // text: `${seconds} ${otpScreenMessage.seconds.defaultMessage}`,
        text: `${seconds}`,
      });
    } else if (minutes === 1) {
      ref.current?.setNativeProps({
        // text: `${minutes} ${otpScreenMessage.minute.defaultMessage} ${seconds} ${otpScreenMessage.seconds.defaultMessage}`,
        text: `${minutes} : ${seconds} `,
      });
    } else {
      ref.current?.setNativeProps({
        // text: `${minutes} ${otpScreenMessage.minutes.defaultMessage} ${seconds} ${otpScreenMessage.seconds.defaultMessage}`,
        text: `${minutes} : ${seconds}`,
      });
    }
  };
  onStart();
  intervalID = setInterval(subtractSecond, interval);
  return intervalID;
};

const stopCountdown = () => {
  if (intervalID) clearInterval(intervalID);
};

export { startCountdown, stopCountdown };
