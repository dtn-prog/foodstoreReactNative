import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../api'; 
import Entypo from '@expo/vector-icons/Entypo';
import { GOMAP_API_KEY } from '../enviroment';

const MapScreen = () => {
  const apiUrl = `${baseUrl}/api/location`;

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      throw error; 
    }
  };

  const { data: restaurantLocation, error, isLoading } = useQuery({
    queryFn: fetchData,
    queryKey: ['location'],
  });

  const [region, setRegion] = useState({
    latitude: 20.971839,
    longitude: 105.7889248,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use this feature.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      if (restaurantLocation) {
        try {
          const response = await axios.get(
            `https://maps.gomaps.pro/maps/api/directions/json?origin=${location.coords.latitude},${location.coords.longitude}&destination=${restaurantLocation.lat},${restaurantLocation.long}&key=${GOMAP_API_KEY}`
          );

          console.log(response.data); 

          const route = response.data.routes[0];
          if (route && route.legs.length > 0) {
            const distanceText = route.legs[0].distance.text;
            setDistance(distanceText);
          } else {
            Alert.alert('No Road Found', 'Could not find a route to the destination. Please check the locations.');
          }
        } catch (error) {
          console.error(`Error fetching distance: ${error.message}`);
          Alert.alert('Error', 'Could not fetch distance data.');
        }
      }
    };

    getCurrentLocation();
  }, [restaurantLocation]);

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading location data</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
      >
        {restaurantLocation && (
          <Marker
            coordinate={{
              latitude: restaurantLocation.lat,
              longitude: restaurantLocation.long,
            }}
            title="Fastfood365"
            description="Your favorite fast food place!"
          >
            <Entypo name="home" size={30} color="blue" />
          </Marker>
        )}
      </MapView>
      {distance && (
        <View style={styles.distanceContainer}>
          <Text>Distance to Fastfood365: {distance}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MapScreen;