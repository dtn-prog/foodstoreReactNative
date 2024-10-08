import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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
      Alert.alert('Registration successful', `Welcome, ${user.name}!`);

      await SecureStore.setItemAsync('userToken', token);
      navigation.navigate('Account'); 
    },
    onError: (error) => {
      Alert.alert('Registration failed', error.response?.data?.message || 'An error occurred');
    },
  });

  const handleRegister = () => {
    if (password !== passwordConfirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      name,
      phone,
      password,
      password_confirmation: passwordConfirm,
    };

    mutation.mutate(userData);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f7f7f7' }}>
      <Text style={{ marginBottom: 24, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Register</Text>
      
      <TextInput
        style={{ padding: 12, marginBottom: 12, height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={{ padding: 12, marginBottom: 12, height: 48, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' }}
        placeholder="Confirm Password"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      
      <Button title="Register" onPress={handleRegister} disabled={mutation.isLoading} />
      
      <Text
        style={{ marginTop: 16, textAlign: 'center', color: '#007BFF' }}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

export default RegisterScreen;