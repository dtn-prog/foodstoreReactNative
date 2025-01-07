import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, ToastAndroid, StyleSheet } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { baseUrl } from '../api'; // Ensure this path is correct

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});

  // Request OTP when the screen is accessed
  useEffect(() => {
    handleRequestOtp();
  }, []);

  const mutation = useMutation({
    mutationFn: async (otpData) => {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post(`${baseUrl}/api/verify-otp`, otpData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      ToastAndroid.showWithGravity(
        data.message || 'OTP verified successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      navigation.navigate('Account'); // Navigate to the account screen
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setErrors({ otp: [errorMessage] });
      ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    },
  });

  const handleVerifyOtp = () => {
    const otpData = { otp };
    setErrors({});
    mutation.mutate(otpData);
  };

  const handleRequestOtp = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      ToastAndroid.showWithGravity('Please log in first.', ToastAndroid.SHORT, ToastAndroid.TOP);
      return;
    }
    
    try {
      const response = await axios.post(`${baseUrl}/api/send-otp`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      ToastAndroid.showWithGravity(response.data.message, ToastAndroid.SHORT, ToastAndroid.TOP);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      ToastAndroid.showWithGravity(errorMessage, ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const handleBackToAccount = () => {
    navigation.navigate('Account'); // Navigate back to the account screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Mã OTP (6 chữ số)"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        placeholderTextColor="#aaa"
        maxLength={6} // Limit input to 6 characters
      />
      {errors.otp && <Text style={styles.errorText}>{errors.otp.join(', ')}</Text>}
      
      <View style={styles.buttonContainer}>
        <Button title="Xác minh OTP" onPress={handleVerifyOtp} disabled={mutation.isLoading} color="#FF3366" />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Gửi lại mã OTP" onPress={handleRequestOtp} color="#FF3366" />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Quay lại tài khoản" onPress={handleBackToAccount} color="#FF3366" />
      </View>
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
    marginBottom: 8,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 2,
    fontSize: 18, // Increased font size for better visibility
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    fontSize: 12,
  },
  buttonContainer: {
    marginVertical: 10, // Space between buttons
  },
});

export default OTPVerificationScreen;