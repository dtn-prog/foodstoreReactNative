import React, { useState } from 'react';
import { View, Text, Button, ToastAndroid, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const orderStatusTranslation = {
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao hàng',
  completed: 'Hoàn thành',
  bombed: 'Đã hủy',
};

const formatMoney = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const AccountScreen = ({ navigation }) => {
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  useFocusEffect(
    React.useCallback(() => {
      const checkUserLogin = async () => {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          navigation.navigate('Login');
        } else {
          setIsLoadingToken(false);
          fetchUserData(token);
        }
      };

      checkUserLogin();
    }, [navigation])
  );

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      ToastAndroid.showWithGravity(
        'Lỗi khi lấy thông tin người dùng',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

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
    enabled: !isLoadingToken,
    refetchOnWindowFocus: true,
  });

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    ToastAndroid.showWithGravity(
      'Bạn đã đăng xuất.',
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
    navigation.navigate('Login');
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderStatus}>Trạng thái: {orderStatusTranslation[item.status]}</Text>
      <Text style={styles.orderDetail}>Địa chỉ: {item.address}</Text>
      <Text style={styles.orderDetail}>Phương thức thanh toán: {item.payment_method}</Text>
      <Text style={styles.orderDetail}>Thời gian: {item.duration}</Text>
      <Text style={styles.orderDetail}>
        Thời gian đặt: {new Date(item.created_at).toLocaleString()}
      </Text>
      <Text style={styles.orderDetail}>
        Tổng giá: {formatMoney(item.total_price)} đ
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

  const filteredOrders = selectedStatus === 'all' 
    ? orderHistory 
    : orderHistory?.filter(order => order.status === selectedStatus);

  if (isLoadingToken) {
    return <Text style={styles.loadingText}>Đang tải...</Text>;
  }

  if (isLoading) {
    return <Text style={styles.loadingText}>Đang tải lịch sử...</Text>;
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
      <View style={styles.userInfoContainer}>
        <MaterialCommunityIcons name="account-circle" size={60} color="#FF3366" />
        <View style={styles.userInfoText}>
          {userData ? (
            <>
              <Text style={styles.userName}>{userData.name}</Text>
              <View style={styles.phoneContainer}>
                <MaterialCommunityIcons name="phone" size={20} color="#FF3366" />
                <Text style={styles.userPhone}>{userData.phone}</Text>
              </View>
              {!userData.phone_verified_at && (
                <Button
                  title="Xác minh số điện thoại"
                  color={"#FF3366"}
                  onPress={() => navigation.navigate('OTPVerification')}
                />
              )}
            </>
          ) : (
            <Text style={styles.loadingText}>Đang tải thông tin người dùng...</Text>
          )}
        </View>
      </View>
      <Button title="Đăng xuất" color={"#FF3366"} onPress={handleLogout} />
      
      {/* Status Filter Buttons */}
      <View style={styles.statusFilterContainer}>
        {['all', 'confirmed', 'shipped', 'completed', 'bombed'].map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.statusButton, selectedStatus === status && styles.selectedStatusButton]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={styles.statusButtonText}>
              {status === 'all' ? 'Tất cả' : orderStatusTranslation[status]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.historyTitle}>Lịch sử:</Text>
      <FlatList
        data={filteredOrders}
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
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
  },
  userInfoText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
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
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statusButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedStatusButton: {
    backgroundColor: '#FF3366',
  },
  statusButtonText: {
    color: '#333',
  },
});

export default AccountScreen;