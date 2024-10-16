import React, { useEffect } from 'react';
import { View, Text, Button, ToastAndroid, FlatList, Image, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AccountScreen = ({ route, navigation }) => {
  const { user } = route.params || {};

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

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
    ToastAndroid.showWithGravity(
      'You have been logged out.',
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
    navigation.navigate('Login');
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
      <Text style={styles.orderDetail}>Địa chỉ: {item.address}</Text>
      <Text style={styles.orderDetail}>Phương thức thanh toán: {item.payment_method}</Text>
      <Text style={styles.orderDetail}>Thời gian: {item.duration}</Text>
      <Text style={styles.orderDetail}>
        Thời gian đặt: {new Date(item.created_at).toLocaleString()}
      </Text>
      {item.items.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Image
            source={{ uri: `${baseUrl}/storage/${product.product_image}` }}
            style={styles.productImage}
          />
          <Text style={styles.productName}>
            {product.product_name} (x{product.quantity})
          </Text>
        </View>
      ))}
    </View>
  );

  if (isLoading) {
    return <Text style={styles.loadingText}>Đang tải...</Text>;
  }

  if (error) {
    return (
      <Text style={styles.errorText}>
        Có lỗi lấy lịch sử: {error.message}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.userInfo}>Tên: {user?.name || 'N/A'}</Text>
      <Text style={styles.userInfo}>Số điện thoại: {user?.phone || 'N/A'}</Text>
      
      <Button title="Đăng xuất" color={"#FF3366"} onPress={handleLogout} />
      <Text style={styles.historyTitle}>Lịch sử:</Text>
      <FlatList
        data={orderHistory}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.created_at}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  userInfo: {
    fontSize: 18,
    marginVertical: 4,
    color: '#333',
  },
  orderItem: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  orderStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetail: {
    marginVertical: 2,
    color: '#555',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
  },
  historyTitle: {
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AccountScreen;