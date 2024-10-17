import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../api';
import ProductCard from '../components/ProductCard';

const CategoryScreen = ({ route }) => {
  const { categoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cats/${categoryId}/products`);
        setProducts(response.data.products);
        setCategoryName(response.data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3366" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lỗi tải: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ProductCard 
              id={item.id} 
              name={item.name} 
              price={item.price} 
              desc={item.desc}
              image={{ uri: `${baseUrl}/storage/${item.image}` }} 
            />
          </View>
        )}
        keyExtractor={item => item.id.toString()} 
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  flatListContent: {
    alignItems: 'center',
  },
});

export default CategoryScreen;