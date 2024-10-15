import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ id, name, price, image, desc }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ProductDetail', { id, name, price, image, desc })} 
      style={styles.card}
    >
      <Image
        source={image}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price} đ</Text>
        {/* <Text style={styles.price}>{desc}</Text> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent background
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  details: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#4CAF50', // Green color for price
    marginTop: 4,
  },
});

export default ProductCard;