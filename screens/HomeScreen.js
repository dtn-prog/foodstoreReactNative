import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Header from '../components/Header';

const HomeScreen = () => {
  return (
    <View>
      <Header></Header>
      <Text>HomeScreen</Text>
      <AntDesign name="laptop" size={24} color="black" />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})