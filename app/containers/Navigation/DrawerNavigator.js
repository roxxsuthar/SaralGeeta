import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Navigation } from '../../constants/constants';
import Home from '../Home';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import Chapters from '../Chapters';
import Shloks from '../Shloks';
import LearnGeeta from '../LearnGeeta';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import ContactUs from '../ContactUs';
import SideBar from './SideBar';
import OurIdeals from '../OurIdeals';

const Drawer = createDrawerNavigator();

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
        gestureEnabled: true,
        gestureHandlerProps: {
          enabled: true,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
      drawerContent={(props) => <SideBar {...props} />}
    >
      <Drawer.Screen name={Navigation.Home} component={Home} />
      <Drawer.Screen name={Navigation.OurIdeals} component={OurIdeals} />
      <Drawer.Screen name={Navigation.Profile} component={Profile} />
      <Drawer.Screen name={Navigation.EditProfile} component={EditProfile} />
      <Drawer.Screen name={Navigation.Chapters} component={Chapters} />
      <Drawer.Screen name={Navigation.Shloks} component={Shloks} />
      <Drawer.Screen name={Navigation.LearnGeeta} component={LearnGeeta} />
      <Drawer.Screen
        name={Navigation.PrivacyPolicy}
        component={PrivacyPolicy}
      />
      <Drawer.Screen name={Navigation.TermsOfUse} component={TermsOfUse} />
      <Drawer.Screen name={Navigation.ContactUs} component={ContactUs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
