import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
  ActivityIndicator,
  StyleSheet,
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
import Header from '../components/Header';

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
          "Cần truy cập vị trí để lấy vị trí hiện tại của bạn.",
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
        `https://maps.gomaps.pro/maps/api/directions/json?origin=${coords.latitude},${coords.longitude}&destination=${response.data.lat},${response.data.long}&mode=driving&key=${GOMAP_API_KEY}&language=vi`
      );

      if (durationResponse.data.routes.length > 0) {
        const durationText = durationResponse.data.routes[0].legs[0].duration.text;
        setDuration(durationText);
      }
    } catch (error) {
      console.error("Error fetching restaurant location:", error);
      ToastAndroid.showWithGravity(
        "Không thể lấy vị trí nhà hàng.",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  const checkLoggedIn = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    if (!token) {
      ToastAndroid.showWithGravity(
        "Vui lòng đăng nhập để tiếp tục thanh toán.",
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
        `Đặt hàng thành công, tổng giá tiền: ${data.totalPrice} đ`,
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
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.quantityButton}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.quantityButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>
        {(item.price * item.quantity)} đ
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} 
        contentContainerStyle={styles.flatListContent} 
      />

      {/* Address Input Field */}
      <View style={styles.inputContainer}>
        <View style={styles.inputLabelContainer}>
          <MaterialIcons name="location-on" size={24} color="#FF3366" />
          <Text style={styles.inputLabel}>Địa chỉ giao hàng</Text>
        </View>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ của bạn"
          style={styles.textInput}
          multiline
          numberOfLines={1} 
          maxLength={100}
        />
      </View>

      {/* Payment Method Picker */}
      <View style={styles.inputContainer}>
        <View style={styles.inputLabelContainer}>
          <MaterialIcons name="payment" size={24} color="#FF3366" />
          <Text style={styles.inputLabel}>Phương thức thanh toán</Text>
        </View>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tiền mặt" value="cod" />
          <Picker.Item label="Thẻ" value="cc" />
        </Picker>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
        </View>
      )}

      <TouchableOpacity
        onPress={handleCheckout}
        style={styles.checkoutButton}
        disabled={loading}
      >
        <Text style={styles.checkoutButtonText}>
          Đặt Hàng: {totalPrice} đ
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  quantityText: {
    marginHorizontal: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  flatListContent: {
    paddingBottom: 100,
  },
  inputContainer: {
    padding: 8,
    marginHorizontal: 8,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
  },
  checkoutButton: {
    padding: 16,
    margin: 8,
    backgroundColor: '#FF3366',
    borderRadius: 5,
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default CartScreen;