package com.zkapp

import com.zkapp.GNSSPackage
import com.zkapp.NoirModule
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.facebook.react.flipper.ReactNativeFlipper // Añade esta importación

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
                add(GNSSPackage())
                add(object : ReactPackage {
                    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
                        return listOf(NoirModule(reactContext))
                    }
                    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
                        return emptyList()
                    }
                })
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
    if (BuildConfig.DEBUG) { // Añade Flipper solo en modo debug
      ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }
  }
}