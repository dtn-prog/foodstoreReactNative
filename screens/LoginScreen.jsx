import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="mb-6 text-2xl font-bold text-center">Login</Text>
      <TextInput
        className="p-2 mb-4 h-12 rounded border border-gray-300"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        className="p-2 mb-4 h-12 rounded border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        className="mt-4 text-center text-blue-500"
        onPress={() => navigation.navigate('Register')}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
};

export default LoginScreen;