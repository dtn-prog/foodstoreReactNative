import axios from 'axios';
import { GOMAP_API_KEY } from './enviroment';

export const getDurationToRestaurant = async (currentLocation, restaurantLocation) => {
  try {
    const response = await axios.get(
      `https://maps.gomaps.pro/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${restaurantLocation.lat},${restaurantLocation.long}&mode=driving&key=${GOMAP_API_KEY}`
    );

    const route = response.data.routes[0];
    if (route && route.legs.length > 0) {
      const durationText = route.legs[0].duration.text;
      return durationText;
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error(`Error fetching duration: ${error.message}`);
    throw error; 
  }
};