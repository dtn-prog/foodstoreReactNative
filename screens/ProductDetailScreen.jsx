import { View, Image, ScrollView, TouchableOpacity, Text, StatusBar, ToastAndroid, StyleSheet } from 'react-native';
import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductDetailScreen = ({ route }) => {
  const { id, name, price, image, desc } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useContext(CartContext);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addItem({ id, name, price, quantity, image });

    ToastAndroid.showWithGravity(
      `${quantity} x ${name} has been added to your cart.`,
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={image}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{name}</Text>
          {/* <Text style={styles.id}>ID: {id}</Text> */}
          <Text style={styles.price}>{formatMoney(price)} đ</Text>
          <Text style={styles.description}>{desc}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const formatMoney = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  price: {
    marginVertical: 10,
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: '600',
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  quantityButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 10,
  },
  addToCartButton: {
    padding: 15,
    backgroundColor: '#FF3366',
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ProductDetailScreen;