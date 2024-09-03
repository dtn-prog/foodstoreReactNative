import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CartIcon = () => {
  return (
    <View className='absolute bottom-5 z-50 w-full'>
      <TouchableOpacity 
        className='flex-row justify-between items-center p-4 mx-5 bg-yellow-500 rounded-full shadow-lg'
      >
        <View className='p-2 px-4 rounded-full bg-slate-600'>
          <Text className='text-lg font-extrabold text-white'>3</Text>
        </View>
        <Text className='flex-1 text-lg font-bold text-center text-white'>
          View Cart
        </Text>
        <Text className='flex-1 text-lg font-extrabold text-center text-white'>
          50000 d
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartIcon;