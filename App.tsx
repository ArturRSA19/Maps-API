import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, Platform, PermissionsAndroid, Dimensions, Alert, TouchableOpacity } from 'react-native';
import MapView, { MapPressEvent, Region, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const { width, height } = Dimensions.get('screen');

const initialRegion = {
  latitude: 37.78825, // Valor de exemplo (latitude inicial)
  longitude: -122.4324, // Valor de exemplo (longitude inicial)
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

interface CustomMarker {
  key: number;
  coords: {
    latitude: number;
    longitude: number;
  };
  pinColor: string;
}

export default function App() {
  const [region, setRegion] = useState<Region | undefined>(initialRegion);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  const handlePress = () => {
    Alert.alert('Botão pressionado', 'Você pressionou o botão!')
  }

  useEffect(() => {
    getMyLocation();
  }, []);

  function getMyLocation() {
    Geolocation.getCurrentPosition(
      (info) => {
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

  function newMarker(e: MapPressEvent) {
    // Limpa os marcadores existentes
    setMarkers([]);

    const data: CustomMarker = {
      key: 0, // Pode ajustar conforme necessário
      coords: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
      },
      pinColor: '#FF0000',
    };

    setRegion({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    setMarkers([data]);
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <MapView
          onMapReady={() => {
            Platform.OS === 'android'
              ? PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(() => {
                  console.log('USUARIO ACEITOU');
                })
              : console.log('USUARIO RECUSOU');
          }}
          style={{ width: width, height: 300 }} // Altura do mapa
          region={region}
          zoomEnabled={true}
          minZoomLevel={17}
          showsUserLocation={true}
          loadingEnabled={true}
          onPress={(e) => newMarker(e)}
        >
          {markers.map((marker) => (
            <Marker key={marker.key} coordinate={marker.coords} pinColor={marker.pinColor} />
          ))}
        </MapView>
        <View style={styles.textContainer}>
          <Text>Texto 1</Text>
          <Text>Texto 2</Text>
          <TouchableOpacity onPress={handlePress}>
            <View style={{backgroundColor: 'blue', padding: 10, borderRadius: 5}}>
              <Text style={{color: 'white'}}>Botão</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20,
    padding: 10,
  },
});
