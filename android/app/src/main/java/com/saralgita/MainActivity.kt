package com.saralgita

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Show splash using default show() overload to avoid missing style reference during build
        SplashScreen.show(this)
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String {
        return "SaralGita"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(this, getMainComponentName())
    }
}
