import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StarIcon, MapPinIcon } from "react-native-heroicons/outline";
import DishRow from '../components/DishRow';
import CartIcon from '../components/CartIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

const RestaurantScreen = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  let item = params;

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <CartIcon />
      <ScrollView>
        <View className='relative'>
          <Image 
            className='w-full h-72 rounded-b-lg' 
            source={item.image} 
            resizeMode='cover'
          />
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className='absolute left-4 top-5 p-2 bg-white rounded-full shadow-md'
          >
            <Text className='font-semibold'>Back</Text>
          </TouchableOpacity>
        </View>
        <View className='p-5 bg-white'>
          <Text className='text-2xl font-bold'>{item.name}</Text>
          <View className='flex-row mt-1 space-x-2'>
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
          <Text className='mt-2 text-gray-500'>{item.description}</Text>
        </View>
        <View className='pb-36 bg-white'>
          <Text className='px-5 py-4 text-lg font-bold'>Menu</Text>
          {/* Dishes */}
          {item.dishes.map(dish => (
            <DishRow key={dish.id} item={{ ...dish }} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RestaurantScreen;