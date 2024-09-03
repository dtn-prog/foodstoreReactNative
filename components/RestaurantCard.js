import { View, Text, TouchableNativeFeedback, Image } from 'react-native';
import React from 'react';
import { StarIcon, MapPinIcon } from "react-native-heroicons/outline";
import { useNavigation } from '@react-navigation/native';

const RestaurantCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableNativeFeedback
    onPress={()=>navigation.navigate('Restaurant', {...item})}>
      <View className='overflow-hidden mr-4 bg-white rounded-lg shadow-md'>
        <View className='relative'>
          <Image 
            source={item.image} 
            className='w-full h-36 rounded-t-lg' 
            resizeMode='contain' 
          />
          {/* Optional overlay for better text contrast */}
          <View className='absolute inset-0 bg-black opacity-10' />
        </View>
        <View className='px-3 pb-4'>
          <Text className='text-lg font-bold'>{item.name}</Text>
          <View className='flex-row items-center space-x-1'>
            <StarIcon color='yellow' size={20} />
            <Text className='text-gray-500'>{item.rating}</Text>
            <Text className='text-gray-500'> · {item.category}</Text>
          </View>
          <View className='flex-row items-center space-x-1'>
            <MapPinIcon color='gray' size={20} />
            <Text className='text-gray-500'>{item.address}</Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default RestaurantCard;