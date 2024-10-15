// ProductDetailScreen.js
import { View, Image, ScrollView, TouchableOpacity, Text, StatusBar, ToastAndroid } from 'react-native';
import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductDetailScreen = ({ route }) => {
  const { id, name, price, image, desc } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useContext(CartContext);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const numericPrice = typeof price === 'number' ? price : 0;
    addItem({ id, name, price: numericPrice, quantity, image });
    
    ToastAndroid.showWithGravity(
      `${quantity} x ${name} has been added to your cart.`,
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <Image
          source={image}
          className="object-cover w-full h-60"
        />
        <View className="p-4">
          <Text className="text-2xl font-bold">{name} | id:{id}</Text>
          <Text className="text-xl text-gray-600">$ {price}</Text>
          <Text>{desc}</Text>
          <View className="flex-row items-center mt-4">
            <TouchableOpacity onPress={decreaseQuantity} className="p-2 bg-gray-200 rounded">
              <Text className="text-lg">-</Text>
            </TouchableOpacity>
            <Text className="mx-4 text-lg">{quantity}</Text>
            <TouchableOpacity onPress={increaseQuantity} className="p-2 bg-gray-200 rounded">
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={handleAddToCart} className="p-4 mx-3 my-6 bg-blue-500 rounded-lg">
        <Text className="text-lg font-semibold text-center text-white">Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;