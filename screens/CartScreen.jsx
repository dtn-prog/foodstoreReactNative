import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import Header from "../components/Header";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { baseUrl } from "../api";
import axios from "axios";
import { GOMAP_API_KEY } from "../enviroment";

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);
  
  const [address, setAddress] = useState(""); 
  const [location, setLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [duration, setDuration] = useState(null);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is required to get your current location.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const addressResult = await Location.reverseGeocodeAsync(currentLocation.coords);
      if (addressResult.length > 0) {
        const { formattedAddress } = addressResult[0];
        setAddress(formattedAddress);
      }

      fetchRestaurantLocation(currentLocation.coords);
    })();
  }, []);

  const fetchRestaurantLocation = async (coords) => {
    const apiUrl = `${baseUrl}/api/location`;
    try {
      const response = await axios.get(apiUrl);
      setRestaurantLocation(response.data);

      const durationResponse = await axios.get(
        `https://maps.gomaps.pro/maps/api/directions/json?origin=${coords.latitude},${coords.longitude}&destination=${response.data.lat},${response.data.long}&mode=driving&key=${GOMAP_API_KEY}`
      );

      if (durationResponse.data.routes.length > 0) {
        const durationText = durationResponse.data.routes[0].legs[0].duration.text;
        setDuration(durationText);
      }
    } catch (error) {
      console.error("Error fetching restaurant location:", error);
      Alert.alert("Error", "Could not fetch restaurant location.");
    }
  };

  const checkLoggedIn = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert("Login Required", "Please log in to proceed with checkout.");
      return;
    }
  };

  const handleCheckout = () => {
    if (!address) {
      Alert.alert("Address Required", "Please enter your address.");
      return;
    }
    checkLoggedIn();
  };

  const renderItem = ({ item }) => (
    <View className="flex-row items-center p-4 my-2 bg-white rounded-lg shadow-md">
      <Image source={item.image} className="w-16 h-16 rounded-lg" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="my-1 text-gray-600">Quantity: {item.quantity}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => decreaseQuantity(item.id)}
            className="p-2 mr-2 bg-gray-300 rounded"
          >
            <Text className="font-bold">-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => increaseQuantity(item.id)}
            className="p-2 mr-2 bg-gray-300 rounded"
          >
            <Text className="font-bold">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            className="p-2 bg-red-500 rounded"
          >
            <Text className="font-bold text-white">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-lg font-bold text-gray-800">
        ${(item.price * item.quantity)}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* <Header /> */}
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={{ paddingBottom: 100 }} 
      />
      <View className="p-1 bg-white border-t border-gray-300">
        <Text className="text-2xl font-bold text-right">
          Total: ${totalPrice}
        </Text>
      </View>

      {/* Address Input Field */}
      <View className="p-1 mx-2">
        <Text className="mb-1 text-base font-bold">Shipping Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          className="p-1 bg-white rounded border border-gray-300"
          multiline
          numberOfLines={1} 
          style={{ maxHeight: 40 }}
        />
      </View>

      {/* Display Current Location Duration */}
      {/* {duration && (
        <View className="p-1 mx-2 mt-1">
          <Text className="text-base font-bold">Delivery Duration: {duration}</Text>
        </View>
      )} */}

      <TouchableOpacity
        onPress={handleCheckout}
        className="p-2 mx-2 my-1 bg-blue-500 rounded"
      >
        <Text className="text-base font-bold text-center text-white">
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;