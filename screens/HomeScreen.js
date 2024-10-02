import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

const HomeScreen = () => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <AntDesign name="laptop" size={24} color="black" />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})