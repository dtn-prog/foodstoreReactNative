import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ id, name, price, image, desc }) => {
  const navigation = useNavigation();
  const { addItem } = useContext(CartContext);

  const handleAddToCart = () => {
    addItem({ id, name, price, image, quantity: 1 });
  };

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
        <TouchableOpacity onPress={handleAddToCart} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
    width: 220,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  details: {
    padding: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },
});

export default ProductCard;