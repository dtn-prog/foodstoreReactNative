import React, { useEffect } from 'react';
import { View, Text, Button, Alert, FlatList, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AccountScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const apiUrl = `${baseUrl}/api/orders/history`;

  const fetchOrderHistory = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const { data: orderHistory, isLoading, error } = useQuery({
    queryKey: ['orderHistory'],
    queryFn: fetchOrderHistory,
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        navigation.navigate('Login');
      } else {
        queryClient.prefetchQuery({
          queryKey: ['orderHistory'],
          queryFn: fetchOrderHistory,
        });
      }
    };

    checkLoggedIn();
  }, [navigation, queryClient]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      queryClient.refetchQueries({ queryKey: ['orderHistory'] });
    });

    return unsubscribe;
  }, [navigation, queryClient]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.navigate('Login');
  };

  const renderOrderItem = ({ item }) => (
    <View className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold">Order Status: {item.status}</Text>
      <Text className="mb-1 text-gray-700">Address: {item.address}</Text>
      <Text className="text-gray-700">Duration: {item.duration}</Text>
      <Text className="my-2 text-gray-700">
        Order Date: {new Date(item.created_at).toLocaleString()}
      </Text>
      <Text className="font-bold">Items:</Text>
      {item.items.map((product, index) => (
        <View key={index} className="flex-row items-center my-2">
          <Image
            source={{ uri: `${baseUrl}/storage/${product.product_image}` }}
            className="mr-2 w-12 h-12 rounded-md"
          />
          <Text className="text-gray-800">
            {product.product_name} (x{product.quantity})
          </Text>
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return <Text className="text-lg text-center">Loading...</Text>;
  }

  if (error) {
    return <Text className="text-lg text-center text-red-500">Error fetching order history: {error.message}</Text>;
  }

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Button title="Logout" onPress={handleLogout} />
      <Text className="mt-6 mb-2 text-lg text-center">Order History:</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.created_at}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default AccountScreen;