/** * *
TermsOfUse
* */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectTermsOfUse from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import { ScrollView } from 'react-native-gesture-handler';
import { IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';


function TermsOfUse() {
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
            <TouchableOpacity activeOpacity={0.8} style={styles.iconContainer}>
              <View style={styles.icon}>
                <IMAGES.Bars height="100%" width="100%" />
              </View>
            </TouchableOpacity>
            <CustomText style={styles.heading}>Terms Of Use</CustomText>
          </View>
          <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.policyContainer}>
            <CustomText style={styles.lable}>Terms and Condition</CustomText>
            <CustomText style={styles.policyText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed
              justo in nisl convallis rhoncus condimentum in nunc. Nulla aliquam
              ante risus, a finibus lacus consequat eu. Sed a auctor purus, a
              vehicula nisi. In hac habitasse platea dictumst. Quisque mauris
              nisl, laoreet suscipit nisi vitae, porttitor accumsan metus. In
              nec dolor nisi. Quisque et dictum risus. Quisque volutpat libero
              nec nibh congue pharetra. Ut et lacinia tortor. Praesent venenatis
              ac tellus ut dictum. Vivamus blandit ante non lacinia varius.
              Vestibulum auctor eros non ligula vulputate, sit amet rutrum
              lectus suscipit. Donec a enim non odio euismod semper. Sed cursus
              dui bibendum, pretium augue in, consequat est. Ut sed ex nulla.
              Suspendisse id elementum libero, at pharetra risus. Curabitur
              ornare nisi sagittis pellentesque maximus. Aliquam ante est,
              sollicitudin ac lobortis a, feugiat iaculis lorem. Nullam porta
              malesuada justo et laoreet. Donec in est eu magna pharetra
              molestie. Maecenas quis dolor et odio bibendum molestie eget quis
              nulla. Nunc et convallis sapien. Sed felis velit, venenatis ut
              elementum et, porttitor eu massa. Nam at magna velit.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed
              justo in nisl convallis rhoncus condimentum in nunc. Nulla aliquam
              ante risus, a finibus lacus consequat eu. Sed a auctor purus, a
              vehicula nisi. In hac habitasse platea dictumst. Quisque mauris
              nisl, laoreet suscipit nisi vitae, porttitor accumsan metus. In
              nec dolor nisi. Quisque et dictum risus. Quisque volutpat libero
              nec nibh congue pharetra. Ut et lacinia tortor. Praesent venenatis
              ac tellus ut dictum. Vivamus blandit ante non lacinia varius.
              Vestibulum auctor eros non ligula vulputate, sit amet rutrum
              lectus suscipit. Donec a enim non odio euismod semper. Sed cursus
              dui bibendum, pretium augue in, consequat est. Ut sed ex nulla.
              Suspendisse id elementum libero, at pharetra risus. Curabitur
              ornare nisi sagittis pellentesque maximus. Aliquam ante est,
              sollicitudin ac lobortis a, feugiat iaculis lorem. Nullam porta
              malesuada justo et laoreet. Donec in est eu magna pharetra
              molestie. Maecenas quis dolor et odio bibendum molestie eget quis
              nulla. Nunc et convallis sapien. Sed felis velit, venenatis ut
              elementum et, porttitor eu massa. Nam at magna velit.
            </CustomText>
          </View>
        </ScrollView>
          </View>
        </View>
      </ImageBackground>
  );
}

TermsOfUse.propTypes = { dispatch: PropTypes.func.isRequired };

const mapStateToProps = createStructuredSelector({
  termsOfUse: makeSelectTermsOfUse(),
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TermsOfUse);
