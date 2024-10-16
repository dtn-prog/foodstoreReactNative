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
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header'

const CartScreen = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useContext(CartContext);
  const queryClient = useQueryClient();
  
  const [address, setAddress] = useState(""); 
  const [location, setLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

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
        "Giỏ hàng của bạn trống.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    if (!address) {
      ToastAndroid.showWithGravity(
        "Nhập địa chỉ.",
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
      payment_method: paymentMethod,
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
        `Đặt hàng thành công, tổng giá tiền: $${data.totalPrice}`,
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
        "Có lỗi trong quá trình đặt hàng",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      console.error(error);
    },
  });

  const renderItem = ({ item }) => (
    <View className="flex-row items-center p-4 my-2 bg-white rounded-lg border border-gray-200 shadow-md">
      <Image source={item.image} className="w-16 h-16 rounded-lg" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold">{item.name}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => decreaseQuantity(item.id)}
            className="p-2 mr-2 bg-gray-300 rounded"
          >
            <Text className="font-bold">-</Text>
          </TouchableOpacity>
          <Text className="my-1 text-gray-600">{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => increaseQuantity(item.id)}
            className="p-2 ml-2 bg-gray-300 rounded"
          >
            <Text className="font-bold">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            className="p-2 ml-2 bg-red-500 rounded-full"
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-lg font-bold text-gray-800">
        {(item.price * item.quantity)} đ
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header></Header>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={{ paddingBottom: 100 }} 
      />

      {/* Address Input Field */}
      <View className="p-1 mx-2">
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="location-on" size={24} color="#FF3366" />
          <Text className="ml-2 text-base font-bold">Địa chỉ giao hàng</Text>
        </View>
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

      {/* Payment Method Picker */}
      <View className="p-1 mx-2">
        <View className="flex-row items-center mb-1">
          <MaterialIcons name="payment" size={24} color="#FF3366" />
          <Text className="ml-2 text-base font-bold">Phương thức trả tiền</Text>
        </View>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          style={{
            height: 50,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 5,
            borderColor: 'gray',
            borderWidth: 1,
          }}
        >
          <Picker.Item label="Tiền mặt" value="cod" />
          <Picker.Item label="Thẻ" value="cc" />
        </Picker>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex absolute inset-0 justify-center items-center bg-gray-200 bg-opacity-50">
          <ActivityIndicator size="large" color="#FF3366" />
        </View>
      )}

      <TouchableOpacity
        onPress={handleCheckout}
        className="p-2 mx-2 my-1 bg-[#FF3366] rounded"
        disabled={loading}
      >
        <Text className="text-base font-bold text-center text-white">
          Đặt Hàng : {totalPrice} đ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;