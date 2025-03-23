package com.saralgeeta

import android.os.Bundle
import org.devio.rn.splashscreen.SplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this) // Uncomment if using react-native-splash-screen
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String = "SaralGeeta"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(
            this,
            mainComponentName,
            // Fix: Use boolean value directly instead of fabricEnabled()
            DefaultNewArchitectureEntryPoint.fabricEnabled
        )
}
