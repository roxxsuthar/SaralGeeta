import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Navigation } from '../../constants/constants';
import Home from '../Home';
import Profile from '../Profile';
import Dashboard from '../Dashboard';
import Chapters from '../Chapters';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import ContactUs from '../ContactUs';
import SideBar from './SideBar';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
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
      <Drawer.Screen name={Navigation.Home} component={Home} />
      <Drawer.Screen name={Navigation.Profile} component={Profile} />
      <Drawer.Screen name={Navigation.Dashboard} component={Dashboard} />
      <Drawer.Screen name={Navigation.Chapters} component={Chapters} />
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
