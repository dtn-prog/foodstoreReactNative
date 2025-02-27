import { View, TextInput, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { baseUrl } from '../api';
import { useQuery } from '@tanstack/react-query';
import ImageSlider from '../components/ImageSlider';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const apiUrl = `${baseUrl}/api/cats/products`;

  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      throw error;
    }
  };

  const { data: categories = [], error, isLoading } = useQuery({
    queryFn: fetchData,
    queryKey: ['products'],
  });

  const [searchQuery, setSearchQuery] = useState('');

  const groupedProducts = Array.isArray(categories)
    ? categories.map(category => ({
        ...category,
        products: category.products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.products.length > 0)
    : [];

  return (
    <View style={styles.container}>
      <Header />
      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <ImageSlider />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      {/* Loading and Error Handling */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF3366" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi tải: {error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={groupedProducts}
          renderItem={({ item: category }) => (
            <View style={styles.categoryContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Category', { categoryId: category.id })} style={styles.categoryButton}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Ionicons name="chevron-forward" size={16} color="#FF3366" />
              </TouchableOpacity>
              <FlatList
                data={category.products}
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
                horizontal
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.horizontalFlatListContent}
              />
            </View>
          )}
          keyExtractor={item => item.id.toString()} 
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
  sliderContainer: {
    height: 220,
    marginBottom: 16,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    paddingLeft: 40,
    fontSize: 16,
    color: '#333',
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3366',
  },
  horizontalFlatListContent: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;