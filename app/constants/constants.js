// All APP constants here.

import { Platform } from "react-native";

const CONSTANTS = {
  ENCode: 'en',
  HICode: 'hi',
  httpString: 'https://',
  largeIconSize: 45,
  smallIconSize: 15,
  time: 150,
};

export const Navigation = {
  AppNavigator: 'AppNavigator',
  DrawerNavigator: 'DrawerNavigator',
  OnboardingOne: 'OnboardingOne',
  OnboardingSecond: 'OnboardingSecond',
  Language: 'Language',
  Login: 'Login',
  OtpScreen: 'OtpScreen',
  OurIdeals: 'OurIdeals',
  Home: 'Home',
  Chapters: 'Chapters',
  EBooks: 'EBooks',
  Shloks: 'Shloks',
  LearnGeeta: 'LearnGeeta',
  Profile: 'Profile',
  EditProfile: 'EditProfile',
  PrivacyPolicy: 'PrivacyPolicy',
  TermsOfUse: 'TermsOfUse',
  ContactUs: 'ContactUs',
  Instructions: 'Instructions',
  Splash: 'Splash',
};
// API Configuration
export const GLADIA_API_KEY = 'bbebcb87-bb37-4aff-b8ba-d5bda7a96f4c';
export const GLADIA_UPLOAD_URL = 'https://api.gladia.io/v2/upload';
export const GLADIA_TRANSCRIPTION_URL =
  'https://api.gladia.io/v2/pre-recorded/';

// Audio Configuration
export const AUDIO_VOLUME = 2.0;
export const AUDIO_FILE_EXTENSION = Platform.OS === 'ios' ? 'm4a' : 'mp4';
export const AUDIO_FILE_PREFIX = 'recording_';

// Video Configuration
export const VIDEO_BUFFER_CONFIG = {
  minBufferMs: 15000,
  maxBufferMs: 50000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000,
};

export const VIDEO_PROGRESS_UPDATE_INTERVAL = 250;

// UI Constants
export const COLOR_ARRAY = ['#9C27B0', '#4CAF50', '#2196F3', '#fb732b'];

// Polling Configuration
export const TRANSCRIPTION_POLL_INTERVAL = 1000;

// File Naming
export const AUDIO_FILE_SUFFIX = '_audio';

export default CONSTANTS;
