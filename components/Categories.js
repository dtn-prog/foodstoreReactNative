import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { categories } from '../constants';

const Categories = () => {
  const [activeCat, setActiveCat] = useState(null);

  return (
    <View className='mt-4'>
      <Text className='text-xl font-bold mb-2'>Categories</Text>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map(category => (
          <View key={category.id} className='items-center mx-2'>
            <TouchableOpacity 
              onPress={() => setActiveCat(category.id)} 
              className={`p-2 rounded-full ${activeCat === category.id ? 'bg-gray-300' : 'bg-white'}`}
            >
              <Image style={{ width: 40, height: 40 }} source={category.image} />
            </TouchableOpacity>
            <Text className='mt-1 text-center text-sm'>{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;