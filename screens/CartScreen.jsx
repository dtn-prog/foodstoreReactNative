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

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } =
    useContext(CartContext);
  
  const [address, setAddress] = useState(""); 
  const [location, setLocation] = useState(null);

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
    })();
  }, []);

  const checkLoggedIn = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      Alert.alert("Login Required", "Please log in to proceed with checkout.");
      return;
    } else {
      Alert.alert("Login", "Already logged in");
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
    <View className="flex-row items-center p-4 my-2 bg-white rounded-lg shadow">
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
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={{ paddingBottom: 100 }} 
      />
      <View className="p-4 bg-white border-t border-gray-300">
        <Text className="text-2xl font-bold text-right">
          Total: ${totalPrice.toFixed(2)}
        </Text>
      </View>

      {/* Address Input Field */}
      <View className="p-4">
        <Text className="mb-2 text-lg font-bold">Shipping Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          className="p-2 rounded border border-gray-300"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Display Current Location */}
      {location && (
        <View className="p-4">
          <Text className="text-lg font-bold">Current Location:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleCheckout}
        className="p-4 mx-4 my-2 bg-blue-500 rounded-lg"
      >
        <Text className="text-lg font-bold text-center text-white">
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;