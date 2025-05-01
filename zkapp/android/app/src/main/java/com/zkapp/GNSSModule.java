package com.zkapp;

import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import com.facebook.react.bridge.*;

public class GNSSModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public GNSSModule(ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
  }

  @Override
  public String getName() {
    return "GNSSModule";
  }

  @ReactMethod
  public void getGnssData(Promise promise) {
    try {
      LocationManager locationManager = (LocationManager) reactContext.getSystemService(ReactApplicationContext.LOCATION_SERVICE);

      locationManager.requestSingleUpdate(LocationManager.GPS_PROVIDER, new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
          WritableMap map = Arguments.createMap();
          map.putDouble("latitude", location.getLatitude());
          map.putDouble("longitude", location.getLongitude());
          promise.resolve(map);
        }

        public void onStatusChanged(String provider, int status, Bundle extras) {}
        public void onProviderEnabled(String provider) {}
        public void onProviderDisabled(String provider) {
          promise.reject("Provider disabled", "GPS provider disabled");
        }
      }, null);

    } catch (SecurityException e) {
      promise.reject("Permission denied", e.getMessage());
    }
  }
}