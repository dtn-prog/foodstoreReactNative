import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
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

  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to use this feature.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Get address from coordinates
      const addressResult = await Location.reverseGeocodeAsync(location.coords);
      if (addressResult.length > 0) {
        const { formattedAddress } = addressResult[0];
        setAddress(formattedAddress);
      }

      if (restaurantLocation) {
        // Get restaurant address from coordinates
        const restaurantAddressResult = await Location.reverseGeocodeAsync({
          latitude: restaurantLocation.lat,
          longitude: restaurantLocation.long,
        });
        if (restaurantAddressResult.length > 0) {
          const { formattedAddress } = restaurantAddressResult[0];
          setRestaurantAddress(formattedAddress);
        }

        try {
          const response = await axios.get(
            `https://maps.gomaps.pro/maps/api/directions/json?origin=${location.coords.latitude},${location.coords.longitude}&destination=${restaurantLocation.lat},${restaurantLocation.long}&mode=driving&key=${GOMAP_API_KEY}`
          );

          const route = response.data.routes[0];
          if (route && route.legs.length > 0) {
            const distanceText = route.legs[0].distance.text;
            const durationText = route.legs[0].duration.text;
            setDistance(distanceText);
            setDuration(durationText);

            const points = route.legs[0].steps.map(step => {
              const { start_location } = step;
              return {
                latitude: start_location.lat,
                longitude: start_location.lng,
              };
            });
            setRouteCoordinates(points);
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
        {/* Marker for current location */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description={address || "Fetching address..."}
            pinColor="green"
          />
        )}

        {restaurantLocation && (
          <Marker
            coordinate={{
              latitude: restaurantLocation.lat,
              longitude: restaurantLocation.long,
            }}
            title="Fastfood365"
            description={restaurantAddress || "Fetching restaurant address..."}
          >
            <Entypo name="home" size={30} color="blue" />
          </Marker>
        )}
        
        {/* Render the polyline for the route */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="red" 
            strokeWidth={3} 
          />
        )}
      </MapView>

      {distance && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>Distance to Fastfood365: {distance}</Text>
          {duration && <Text style={styles.distanceText}>Estimated Travel Time: {duration}</Text>} 
          {address && <Text style={styles.distanceText}>Your Address: {address}</Text>} 
          {restaurantAddress && <Text style={styles.distanceText}>Restaurant Address: {restaurantAddress}</Text>} 
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
    marginBottom: 60, 
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  listView: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  distanceText: {
    fontSize: 16,
    marginBottom: 5,
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