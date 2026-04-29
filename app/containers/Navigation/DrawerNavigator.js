import React from 'react';
import { Dimensions } from 'react-native';
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
import StudentGift from '../StudentGift';
import TeacherGift from '../TeachGeeta';
import WriteGita from '../WriteGita';
import GitaRules from '../GitaRules';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        drawerStyle: {
          width: Dimensions.get('window').width > 600 ? 320 : '80%',
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
      <Drawer.Screen name={Navigation.StudentGift} component={StudentGift} />
      <Drawer.Screen name={Navigation.TeachGeeta} component={TeacherGift} />
      <Drawer.Screen name={Navigation.WriteGita} component={WriteGita} />
      <Drawer.Screen name={Navigation.GitaRules} component={GitaRules} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
