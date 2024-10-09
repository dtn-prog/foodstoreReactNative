import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ToastAndroid } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        navigation.navigate('Account'); 
      }
    };

    checkLoggedIn();
  }, []);

  const mutation = useMutation({
    mutationFn: async (loginData) => {
      const response = await axios.post(`${baseUrl}/api/login`, loginData);
      return response.data;
    },
    onSuccess: async (data) => {
      const { user, token } = data; 
      ToastAndroid.showWithGravity(
        `Welcome back, ${user.name}!`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );

      await SecureStore.setItemAsync('userToken', token);
      navigation.navigate('Account'); 
    },
    onError: (error) => {
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'An error occurred',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    },
  });

  const handleLogin = () => {
    const loginData = {
      phone,
      password,
    };

    mutation.mutate(loginData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f7f7f7' }}>
      <Text style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
      
      <TextInput
        style={{ padding: 12, marginBottom: 12, height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={{ padding: 12, marginBottom: 12, height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Button title="Login" onPress={handleLogin} disabled={mutation.isLoading} />
      
      <Text
        style={{ marginTop: 16, textAlign: 'center', color: '#007BFF' }}
        onPress={() => navigation.navigate('Register')}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
};

export default LoginScreen;