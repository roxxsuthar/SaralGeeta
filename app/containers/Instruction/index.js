/** * *
Instruction
* */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectInstruction from './selectors';
import styles from './styles';
import { IMAGES } from '../../constants';
import { TouchableOpacity, Text } from 'react-native';
import CustomText from '../../components/CustomText';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import strings from '../../../i18n';

function Instruction() {
  const { Instruction: InstructionMessage } = strings;
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={IMAGES.AppBackground}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.iconContainer}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <View style={styles.icon}>
              <IMAGES.Bars height="100%" width="100%" />
            </View>
          </TouchableOpacity>
          <CustomText style={styles.heading}>
            {InstructionMessage.heading.defaultMessage}
          </CustomText>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.policyContainer}>
              <CustomText style={styles.lable}>
                {InstructionMessage.heading.defaultMessage}
              </CustomText>
            </View>
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
}

Instruction.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  instruction: makeSelectInstruction(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Instruction);
