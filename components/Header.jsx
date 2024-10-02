import { View, Image } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = () => {
  return (
    <View className="flex-row justify-between items-center p-4 bg-white shadow-md">
      <View className="flex-row items-center">
        <AntDesign name="appstore1" size={24} color="black" />
      </View>
      <Image
        source={require('../assets/profile.png')}
        className="w-10 h-10 rounded-full"
      />
    </View>
  );
};

export default Header;