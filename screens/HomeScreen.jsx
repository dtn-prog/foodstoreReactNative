import { View, TextInput, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { baseUrl } from '../api';
import { useQuery } from '@tanstack/react-query';
import ImageSlider from '../components/ImageSlider';

const HomeScreen = () => {
  const apiUrl = `${baseUrl}/api/products`;

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      throw error; 
    }
  };

  const { data: products = [], error, isLoading } = useQuery({
    queryFn: fetchData,
    queryKey: ['products'],
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Image Slider */}
      <ImageSlider />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search products..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Loading and Error Handling */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error fetching products: {error.message}</Text>
        </View>
      ) : (
        // Products Grid
        <FlatList
          data={filteredProducts} 
          renderItem={({ item }) => (
            <ProductCard 
              id={item.id} 
              name={item.name} 
              price={item.price} 
              desc={item.desc}
              image={{ uri: `${baseUrl}/storage/${item.image}` }} 
            />
          )}
          keyExtractor={item => item.id.toString()} 
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2, // Adds shadow effect
  },
  searchInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 40, // Space for icon
    fontSize: 16,
    color: '#333',
    borderRadius: 25,
    backgroundColor: 'transparent', // Transparent background
  },
  searchIcon: {
    position: 'absolute',
    left: 12, // Position the icon inside the input
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  flatListContent: {
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;