import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ToastAndroid, Image, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState({});

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
    mutationFn: async (userData) => {
      const response = await axios.post(`${baseUrl}/api/register`, userData);
      return response.data;
    },
    onSuccess: async (data) => {
      const { user, token } = data; 
      ToastAndroid.showWithGravity(
        `Welcome, ${user.name}!`,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );

      await SecureStore.setItemAsync('userToken', token);
      navigation.navigate('Account');
    },
    onError: (error) => {
      const errorData = error.response?.data?.errors || {};
      setErrors(errorData);
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'An error occurred',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    },
  });

  const handleRegister = () => {
    if (password !== passwordConfirm) {
      ToastAndroid.showWithGravity(
        'Passwords do not match',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    const userData = {
      name,
      phone,
      password,
      password_confirmation: passwordConfirm,
    };

    setErrors({});
    mutation.mutate(userData);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icons/icon_with_name.png')} style={styles.logo} />
      
      <Text style={styles.title}>Đăng ký</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.join(', ')}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.join(', ')}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#aaa"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.join(', ')}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        placeholderTextColor="#aaa"
      />
      {errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation.join(', ')}</Text>}
      
      <Button title="Đăng ký" onPress={handleRegister} disabled={mutation.isLoading} color="#FF3366" />
      
      <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập 
        <Text style={styles.loginLink}> Tại đây</Text>
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
    marginBottom: 8,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: 16, 
    fontSize: 12,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FF3366',
    fontSize: 16,
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;