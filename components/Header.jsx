import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = () => {
  const navigation = useNavigation();

  const goToAccount = () => {
    navigation.navigate('AccountStack');
  };

  return (
    <View style={styles.headerContainer}>
      <Image 
        source={require('../assets/icons/icon_with_name_on_row.png')}
        style={styles.logo}
      />
      <AntDesign 
        name="user" 
        size={24} 
        color="black" 
        style={styles.icon} 
        onPress={goToAccount} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logo: {
    width: 140,
    height: 50,
    resizeMode: 'contain', 
  },
  icon: {
    padding: 10,
  },
});

export default Header;