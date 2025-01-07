import React, { useState } from 'react';
import { View, TextInput, Button, Text, ToastAndroid, StyleSheet } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../api';

const RequestPasswordResetScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleRequestReset = async () => {
    try {
      await axios.post(`${baseUrl}/api/password/reset/request`, { phone });
      ToastAndroid.showWithGravity(
        'OTP has been sent to your phone.',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      navigation.navigate('VerifyOTP', { phone });
    } catch (error) {
      ToastAndroid.showWithGravity(
        error.response?.data?.message || 'An error occurred',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Password Reset</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor="#aaa"
      />
      <Button title="Send OTP" onPress={handleRequestReset} color="#FF3366" />
      <Button title="Cancel" onPress={() => navigation.navigate('Login')} color="#aaa" />
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
  },
});

export default RequestPasswordResetScreen;