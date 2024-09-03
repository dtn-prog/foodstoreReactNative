import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import RestaurantCard from './RestaurantCard';

const FeaturedRow = ({ title, restaurants, description }) => {
  return (
    <View className='mb-5'>
      <View className='flex-row justify-between items-center px-4'>
        <View>
          <Text className='text-lg font-bold'>{title}</Text>
          <Text className='text-gray-500'>{description}</Text>
        </View>
        <TouchableOpacity>
          <Text className='font-semibold text-gray-500'>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 15 }} 
        className='overflow-visible py-5'
        horizontal 
        showsHorizontalScrollIndicator={false}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} item={restaurant} />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;