import React, { useState } from 'react';
import { View, TextInput, Button, Text, ToastAndroid, StyleSheet } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../api';

const VerifyOTPScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleVerifyOtp = async () => {
    if (newPassword !== confirmPassword) {
      ToastAndroid.showWithGravity(
        'Passwords do not match.',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      return;
    }

    try {
      await axios.post(`${baseUrl}/api/password/reset/verify`, {
        phone,
        otp,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      ToastAndroid.showWithGravity(
        'Password reset successfully!',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      navigation.navigate('Login');
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
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#aaa"
      />
      <Button title="Reset Password" onPress={handleVerifyOtp} color="#FF3366" />
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

export default VerifyOTPScreen;