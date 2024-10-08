import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { baseUrl } from '../api';
import Entypo from '@expo/vector-icons/Entypo';

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

  const [route, setRoute] = useState([]);

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
      
      // Fetch directions after getting the current location
      await getDirections(location.coords.latitude, location.coords.longitude);
    };

    getCurrentLocation();
  }, []);

  const getDirections = async (currentLat, currentLong) => {
    if (restaurantLocation) {
      try {
        const response = await axios.get(
          `http://router.project-osrm.org/route/v1/driving/${currentLong},${currentLat};${restaurantLocation.long},${restaurantLocation.lat}?overview=full`
        );
        const routeData = response.data.routes[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRoute(routeData);
      } catch (error) {
        Alert.alert('Error', 'Could not fetch directions');
      }
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading location data</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
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
        
        {/* Show the route on the map */}
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="red" // Customize color
            strokeWidth={4}   // Customize width
          />
        )}
      </MapView>
    </View>
  );
};

export default MapScreen;