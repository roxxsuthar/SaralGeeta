import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Navigation } from '../../constants/constants';
import Home from '../Home';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import Dashboard from '../Dashboard';
import Chapters from '../Chapters';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import ContactUs from '../ContactUs';
import SideBar from './SideBar';
import Shloks from '../Shloks';
import LearnGeeta from '../LearnGeeta';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// StackNavigator for Home
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.Home} component={Home} />
  </Stack.Navigator>
);

// StackNavigator for Profile and EditProfile
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.Profile} component={Profile} />
    <Stack.Screen name={Navigation.EditProfile} component={EditProfile} />
  </Stack.Navigator>
);

// StackNavigator for Dashboard
const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.Dashboard} component={Dashboard} />
  </Stack.Navigator>
);

// StackNavigator for Chapters
const ChaptersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.Chapters} component={Chapters} />
  </Stack.Navigator>
);

// StackNavigator for PrivacyPolicy
const PrivacyPolicyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.PrivacyPolicy} component={PrivacyPolicy} />
  </Stack.Navigator>
);

// StackNavigator for TermsOfUse
const TermsOfUseStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.TermsOfUse} component={TermsOfUse} />
  </Stack.Navigator>
);

// StackNavigator for ContactUs
const ContactUsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={Navigation.ContactUs} component={ContactUs} />
  </Stack.Navigator>
);

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={Navigation.Home}
      screenOptions={{
        drawerStyle: {
          width: '75%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        headerShown: false,
      }}
      drawerContent={(props) => <SideBar {...props} />}
    >
      <Drawer.Screen name={Navigation.Home} component={HomeStack} />
      <Drawer.Screen name={Navigation.Profile} component={ProfileStack} />
      <Drawer.Screen name={Navigation.Dashboard} component={DashboardStack} />
      <Drawer.Screen
        name={Navigation.PrivacyPolicy}
        component={PrivacyPolicyStack}
      />
      <Drawer.Screen name={Navigation.TermsOfUse} component={TermsOfUseStack} />
      <Drawer.Screen name={Navigation.ContactUs} component={ContactUsStack} />
      <Drawer.Screen name={Navigation.Chapters} component={ChaptersStack} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
