import { View, Image, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const ProductCard = ({ name, price, image }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={()=>{navigation.navigate('ProductDetail')}}
    className="overflow-hidden flex-1 m-2 bg-white rounded-lg shadow-md"> 
      <Image
        source={image}
        className="object-cover w-full h-40" 
        style={{ height: 150 }}
      />
      <View className="p-4">
        <Text className="text-lg font-semibold">{name}</Text>
        <Text className="text-base text-gray-600">{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;