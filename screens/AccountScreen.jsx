import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const AccountScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        navigation.navigate('Login'); 
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    Alert.alert('Logged Out', 'You have been logged out.');
    navigation.navigate('Login'); 
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7f7' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Account Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default AccountScreen;