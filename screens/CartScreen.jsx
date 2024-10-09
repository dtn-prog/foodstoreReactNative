import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { baseUrl } from "../api";
import axios from "axios";
import { GOMAP_API_KEY } from "../enviroment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useContext(CartContext);
  const queryClient = useQueryClient();
  
  const [address, setAddress] = useState(""); 
  const [location, setLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        ToastAndroid.showWithGravity(
          "Location access is required to get your current location.",
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        );
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
      ToastAndroid.showWithGravity(
        "Could not fetch restaurant location.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  const checkLoggedIn = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      ToastAndroid.showWithGravity(
        "Please log in to proceed with checkout.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return false;
    }
    return token;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      ToastAndroid.showWithGravity(
        "Your cart is empty. Please add items to proceed.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    if (!address) {
      ToastAndroid.showWithGravity(
        "Please enter your address.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    const token = await checkLoggedIn();
    if (!token) return;

    setLoading(true);
    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const payload = {
      lat: location.coords.latitude,
      long: location.coords.longitude,
      address,
      duration,
      items,
    };

    checkoutMutation.mutate({ payload, token });
  };

  const checkoutMutation = useMutation({
    mutationFn: async ({ payload, token }) => {
      const response = await axios.post(`${baseUrl}/api/orders/place`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setLoading(false);
      ToastAndroid.showWithGravity(
        `Checkout Successful! Total Price: $${data.totalPrice}`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      clearCart();
      
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['orderHistory'] });
    },
    onError: (error) => {
      setLoading(false);
      ToastAndroid.showWithGravity(
        "There was an error processing your order.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      console.error(error);
    },
  });

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
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={{ paddingBottom: 100 }} 
      />
      <View className="p-1 bg-white border-t border-gray-300">
        <Text className="text-2xl font-bold text-right">
          Total: ${totalPrice.toFixed(2)}
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

      {/* Loading Indicator */}
      {loading && (
        <View className="flex absolute inset-0 justify-center items-center bg-gray-200 bg-opacity-50">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      <TouchableOpacity
        onPress={handleCheckout}
        className="p-2 mx-2 my-1 bg-blue-500 rounded"
        disabled={loading}
      >
        <Text className="text-base font-bold text-center text-white">
          Checkout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;