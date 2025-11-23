import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Navigation } from '../../constants/constants';
import HomeStackNavigator from './HomeStackNavigator';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import ContactUs from '../ContactUs';
import SideBar from './SideBar';
import OurIdeals from '../OurIdeals';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
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
      <Drawer.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name={Navigation.OurIdeals} component={OurIdeals} />
      <Drawer.Screen name={Navigation.Profile} component={Profile} />
      <Drawer.Screen name={Navigation.EditProfile} component={EditProfile} />
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
