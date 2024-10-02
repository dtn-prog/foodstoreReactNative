import { View, Image, Text } from 'react-native';
import React from 'react';

const ProductCard = ({ name, price, image }) => {
  return (
    <View className="overflow-hidden flex-1 m-2 bg-white rounded-lg shadow-md"> 
      <Image
        source={image}
        className="object-cover w-full h-40" 
        style={{ height: 150 }}
      />
      <View className="p-4">
        <Text className="text-lg font-semibold">{name}</Text>
        <Text className="text-base text-gray-600">{price}</Text>
      </View>
    </View>
  );
};

export default ProductCard;