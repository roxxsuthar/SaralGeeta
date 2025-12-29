/** * *
TermsOfUse
* */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground, Text } from 'react-native';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectTermsOfUse from './selectors';
import styles from './styles';
import CustomText from '../../components/CustomText';
import { ScrollView } from 'react-native-gesture-handler';
import { IMAGES } from '../../constants';
import { TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import strings from '../../../i18n';

function TermsOfUse() {
  const { TermsOfUse: TermsOfUseMessage } = strings;
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
            {TermsOfUseMessage.heading.defaultMessage}
          </CustomText>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.policyContainer}>
              <CustomText style={styles.lable}>
                {TermsOfUseMessage.termsAndCondition.defaultMessage}
              </CustomText>
              <View style={styles.section}>
                <Text style={styles.bodyTextJustify}>
                  We request the users of the services provided by the Gita Seva
                  to please read the agreement carefully and if you Do Not agree
                  with the Terms mentioned here, you should not use the
                  services.
                </Text>

                <Text style={styles.bodyTextJustify}>
                  Gita Seva may, at its sole discretion, modify these Terms at
                  any time without any prior notice. If you continue to browse
                  the site or applications and make use of the services
                  provided, it will mean that you are agreeing to all the
                  policies and Terms of Use.
                </Text>

                <Text style={styles.bodyTextJustify}>
                  We also want to state that the applications or website is just
                  for the awareness and personal use purpose and we Do Not
                  intend to hurt anyone’s religious sentiments or beliefs, if
                  there is anything that is inappropriate then you may please
                  reach out to our team.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.subHeading}>Use of the Services</Text>
                <View style={styles.numberedList}>
                  <Text style={styles.numberedItem}>
                    1. In order to access the comprehensive services, you need
                    to have an account with the Gita Seva.
                  </Text>
                  <Text style={styles.numberedItem}>
                    2. You should not use any other person’s name or other
                    details to impersonate any other person or individual.
                  </Text>
                  <Text style={styles.numberedItem}>
                    3. You warrant that you are of the legal age to understand
                    the Policies and the Terms of usage and if you are not of
                    the legal age, then you may seek your parent’s guidance to
                    understand the points.
                  </Text>
                  <Text style={styles.numberedItem}>
                    4. You agree not to access or attempt to access any service
                    or feature by any means other than what is provided through
                    the interface of the Website and Applications. You also
                    agree not to access or make any deliberate attempt to access
                    the services through the automated processes including the
                    use of Scripts or Crawlers.
                  </Text>
                  <Text style={styles.numberedItem}>
                    5. You agree that you will not indulge in any practice that
                    interferes with the services provided by Gita Seva or
                    disrupts the process of providing the services which
                    primarily includes the Servers or the Networks which are
                    connected to the services.
                  </Text>
                  <Text style={styles.numberedItem}>
                    6. You agree that you will not copy, reproduce, duplicate,
                    sell, trade or resell the services for any purpose.
                  </Text>
                  <Text style={styles.numberedItem}>
                    7. You agree that you will be solely responsible for any
                    breach of the obligations.
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.subHeading}>Creating Account</Text>
                <Text style={styles.bodyTextJustify}>
                  You understand and agree that you are solely responsible for
                  creating your account and maintaining its confidentiality. You
                  also take full responsibility for all the actions performed
                  from your account and that Gita Seva is not responsible for
                  any of the actions taken on behalf of your account.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.subHeading}>Content in the Services</Text>
                <Text style={styles.bodyTextJustify}>
                  You understand that all the information such as audios, media,
                  and images which are accessible to you from the website or the
                  applications is the sole responsibility of the source from
                  which it was created. If some content is cached, it is done so
                  to deliver the best possible services to the users. If you
                  find any content objectionable, please feel free to inform the
                  team at your convenience.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.subHeading}>Applications</Text>
                <Text style={styles.bodyTextJustify}>
                  These terms apply to the use of all the services through
                  mobile applications:
                </Text>
                <View style={styles.numberedList}>
                  <Text style={styles.numberedItem}>
                    1. The applications are available and licensed to you on a
                    limited, non-exclusive, and non-transferrable basis solely
                    for personal purposes and not any business, trade, or
                    commercial use.
                  </Text>
                  <Text style={styles.numberedItem}>
                    2. You will only use the application on a device that is
                    owned by you.
                  </Text>
                  <Text style={styles.numberedItem}>
                    3. You acknowledge that any action taken by any individual
                    from your account shall be deemed to be performed by you.
                  </Text>
                </View>
              </View>
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
