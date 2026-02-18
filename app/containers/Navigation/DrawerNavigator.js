import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Navigation } from '../../constants/constants';
import HomeStackNavigator from './HomeStackNavigator';
import SideBar from './SideBar';
import OurIdeals from '../OurIdeals';
import ContactUs from '../ContactUs';
import PrivacyPolicy from '../PrivacyPolicy';
import TermsOfUse from '../TermsOfUse';
import Instruction from '../Instruction';
import Language from '../Language';

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
      <Drawer.Screen name={Navigation.ContactUs} component={ContactUs} />
      <Drawer.Screen name={Navigation.PrivacyPolicy} component={PrivacyPolicy} />
      <Drawer.Screen name={Navigation.TermsOfUse} component={TermsOfUse} />
      <Drawer.Screen name={Navigation.Instructions} component={Instruction} />
      <Drawer.Screen name={Navigation.Language} component={Language} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
