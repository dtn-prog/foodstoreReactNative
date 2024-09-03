import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MagnifyingGlassIcon, MapPinIcon, AdjustmentsVerticalIcon } from "react-native-heroicons/outline";
import Categories from '../components/Categories';
import { featured } from '../constants';
import FeaturedRow from '../components/FeaturedRow';

const HomeScreen = () => {
  return (
    <SafeAreaView className='flex-1 bg-white'>
      <StatusBar barStyle='dark-content' />

      {/* Search Bar */}
      <View className='flex-row items-center px-4 pb-2 space-x-2'>
        <View className='flex-row flex-1 items-center p-3 bg-white rounded-full border border-gray-300'>
          <MagnifyingGlassIcon height={25} width={25} stroke='gray' />
          <TextInput 
            placeholder='Restaurants'
            className='flex-1 ml-2 font-bold text-gray-700'
            style={{ height: 40 }}
          />
          <View className='flex-row items-center pl-2 space-x-1 border-l-2 border-l-gray-300'>
            <MapPinIcon height={20} width={20} stroke='gray' />
            <Text className='font-semibold text-gray-600'>Location</Text>
          </View>
        </View>
        <View className='p-3 bg-gray-300 rounded-full'>
          <AdjustmentsVerticalIcon height={20} width={20} strokeWidth={2.5} stroke='white' />
        </View>
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Categories */}
        <Categories />

        {/* Featured Rows */}
        <View className='mt-5'>
          {[featured].map((item) => (
            <FeaturedRow 
              key={item.id} 
              title={item.title} 
              restaurants={item.restaurants} 
              description={item.description} 
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;