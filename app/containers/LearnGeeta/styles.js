import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Ensures the background is black during playback
  },
  gradientBorder: {
    flex: 1,
    overflow: 'hidden', // Ensures video stays within the border
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrapper: {
    width: '100%',
    overflow: 'hidden', // Clip video to fit within border
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
});

export default styles;
