import { View, TextInput, FlatList } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';

const products = [
  { id: '1', name: 'Bun Dau Mam Tom', price: '$40', image: require('../assets/bun.jpg') },
  { id: '2', name: 'Pho Bo', price: '$50', image: require('../assets/pho.jpg') },
  { id: '3', name: 'Goi Cuon', price: '$30', image: require('../assets/bun.jpg') },
  { id: '4', name: 'Com Tam', price: '$35', image: require('../assets/pho.jpg') },
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Header />

      {/* Search Bar */}
      <View className="flex-row items-center p-4">
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          placeholder="Search..."
          className="flex-1 p-2 ml-2 rounded-lg border border-gray-300"
          style={{ height: 40 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts} 
        renderItem={({ item }) => (
          <ProductCard name={item.name} price={item.price} image={item.image} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 20, justifyContent: 'space-between' }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};

export default HomeScreen;