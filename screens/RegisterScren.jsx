import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleRegister = () => {
    // Handle registration logic here
  };

  return (
    <View className="flex-1 justify-center p-4 bg-gray-100">
      <Text className="mb-6 text-2xl font-bold text-center">Register</Text>
      
      <TextInput
        className="p-2 mb-4 h-12 rounded border border-gray-300"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        className="p-2 mb-4 h-12 rounded border border-gray-300"
        placeholder="Confirm Password"
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />
      
      <Button title="Register" onPress={handleRegister} />
      
      <Text
        className="mt-4 text-center text-blue-500"
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>
    </View>
  );
};

export default RegisterScreen;