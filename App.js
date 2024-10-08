import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext';
import AccountScreen from './screens/AccountScreen';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScren';
import ReorderScreen from './screens/ReorderScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return(
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={HomeScreen}/>
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/>
  </Stack.Navigator>
  )
};

const AccountStack = () => {
  return(
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Account" component={AccountScreen}/>
    <Stack.Screen name="Login" component={LoginScreen}/>
    <Stack.Screen name="Register" component={RegisterScreen}/>
  </Stack.Navigator>
  )
}

export default function App() {
  const queryCLient = new QueryClient();

  return (
    <QueryClientProvider client={queryCLient}>
      <CartProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{
            headerShown: false, tabBarActiveTintColor: 'blue'
          }}>
            <Tab.Screen name="HomeStack" component={HomeStack} 
            options={{tabBarIcon:()=><Entypo name="home" size={24} color="black" />}}/>
            <Tab.Screen name="Reorder" component={ReorderScreen} 
            options={{tabBarIcon:()=><Entypo name="list" size={24} color="black" />}}/>
            <Tab.Screen name="Cart" component={CartScreen} 
            options={{tabBarIcon:()=><Entypo name="shopping-cart" size={24} color="black" />}}/>
            <Tab.Screen name="Account" component={AccountStack} 
            options={{tabBarIcon:()=><Entypo name="user" size={24} color="black" />}}/>
          </Tab.Navigator>
        </NavigationContainer>
      </CartProvider>
    </QueryClientProvider>
  );
}