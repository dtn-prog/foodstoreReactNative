import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/Header';

const CartScreen = () => {
  const initialCartItems = [
    { id: '1', name: 'Bun Dau Mam Tom', price: 40, quantity: 2, image: require('../assets/pho.jpg') },
    { id: '2', name: 'Pho Bo', price: 50, quantity: 1, image: require('../assets/pho.jpg') },
    { id: '3', name: 'Goi Cuon', price: 30, quantity: 3, image: require('../assets/pho.jpg') },
  ];

  const [cartItems, setCartItems] = useState(initialCartItems);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const increaseQuantity = (id) => {
    setCartItems((prevItems) => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) => 
      prevItems.map(item =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View className="flex-row items-center p-4 my-2 bg-white rounded-lg shadow">
      <Image source={item.image} className="w-16 h-16 rounded-lg" />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text className="my-1 text-gray-600">Quantity: {item.quantity}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)} className="p-2 mr-2 bg-gray-300 rounded">
            <Text className="font-bold">-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)} className="p-2 mr-2 bg-gray-300 rounded">
            <Text className="font-bold">+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.id)} className="p-2 bg-red-500 rounded">
            <Text className="font-bold text-white">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="text-lg font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Header />
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle="pb-24"
      />

      {/* Total Price Section */}
      <View className="p-4 bg-white border-t border-gray-300">
        <Text className="text-2xl font-bold text-right">Total: ${totalPrice.toFixed(2)}</Text>
      </View>

      {/* Checkout Button */}
      <TouchableOpacity className="p-4 mx-4 my-2 bg-blue-500 rounded-lg">
        <Text className="text-lg font-bold text-center text-white">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;