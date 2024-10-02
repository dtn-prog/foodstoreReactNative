import { View, TextInput } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Header from '../components/Header';

const HomeScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-row items-center p-4">
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          placeholder="Search..."
          className="flex-1 p-2 ml-2 rounded-lg border border-gray-300"
          style={{ height: 40 }} // Set a specific height for the TextInput
        />
      </View>
    </View>
  );
};

export default HomeScreen;