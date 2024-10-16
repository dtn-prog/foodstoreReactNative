import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ToastAndroid, Image, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Image source={require('../assets/icons/icon_with_name.png')} style={styles.logo} />
      <Text style={styles.title}>Login to Your Account</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />
      
      <Button title="Login" onPress={handleLogin} disabled={mutation.isLoading} color="#007BFF" />
      
      <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
        Don't have an account? <Text style={styles.registerLink}>Register</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 32,
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    padding: 12,
    marginBottom: 16,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2, // For slight shadow effect on Android
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
    fontSize: 16,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;