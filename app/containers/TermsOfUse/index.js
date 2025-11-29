/** * *
TermsOfUse
* */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StatusBar, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';

import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import makeSelectTermsOfUse from './selectors';
import { getTerms } from './actions';
import styles from './styles';
import CustomText from '../../components/CustomText';
import LoadingScreen from '../../components/LoadingScreen';
import { IMAGES, COLORS } from '../../constants';
import { TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import strings from '../../../i18n';
import makeSelectApp from '../App/selectors';

function TermsOfUse({ termsOfUse, handleGetTerms, app }) {
  const { TermsOfUse: TermsOfUseMessage } = strings;
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch terms of use data when component mounts
    handleGetTerms('terms');
  }, [handleGetTerms]);

  const { loading, data } = termsOfUse;

  // HTML template for WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 15px;
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
            color: #333;
          }
          h1 {
            color: ${COLORS.orange || '#FF6B35'};
            font-size: 24px;
            margin-bottom: 15px;
          }
          h2 {
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          h3 {
            font-size: 18px;
            margin-top: 15px;
            margin-bottom: 8px;
          }
          p {
            margin-bottom: 12px;
            text-align: justify;
          }
          ul, ol {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        ${data?.content || data?.description || '<p>Loading content...</p>'}
      </body>
    </html>
  `;

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
          {loading ? (
            <LoadingScreen currentLanguage={app?.language} />
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              style={styles.webview}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

TermsOfUse.propTypes = {
  termsOfUse: PropTypes.object,
  handleGetTerms: PropTypes.func,
  app: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  termsOfUse: makeSelectTermsOfUse(),
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleGetTerms: (policyType) => dispatch(getTerms(policyType)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TermsOfUse);
