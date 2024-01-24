import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid, Dimensions } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('screen');

const initialRegion = {
  latitude: 37.78825, // Valor de exemplo (latitude inicial)
  longitude: -122.4324, // Valor de exemplo (longitude inicial)
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const [region, setRegion] = useState<Region | undefined>(initialRegion);

  useEffect(() => {
    getMyLocation();
  }, []);

  function getMyLocation() {
    Geolocation.getCurrentPosition(info => {
        console.log('LATITUDE: ', info.coords.latitude);
        console.log('LONGITUDE: ', info.coords.longitude);
        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => console.error('Error getting location: ', error),
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        onMapReady={() => {
          Platform.OS === 'android'
            ? PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(() => {
                console.log('USUARIO ACEITOU');
              })
            : console.log('USUARIO RECUSOU');
        }}
        style={{ width: width, height: height }}
        region={region}
        zoomEnabled={true}
        minZoomLevel={17}
        showsUserLocation={true}
        loadingEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
