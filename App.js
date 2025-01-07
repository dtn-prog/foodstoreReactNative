import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CategoryScreen from './screens/CategoryScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './context/CartContext';
import AccountScreen from './screens/AccountScreen';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MapScreen from './screens/MapScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} /> 
  </Stack.Navigator>
);

const AccountStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
  </Stack.Navigator>
);

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#FF3366' }}>
            <Tab.Screen
              name="HomeStack"
              component={HomeStack}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Entypo name="home" size={24} color={focused ? '#FF3366' : 'black'} />
                ),
                tabBarLabel: 'Trang chủ',
              }}
            />
            <Tab.Screen
              name="Cart"
              component={CartScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Entypo name="shopping-cart" size={24} color={focused ? '#FF3366' : 'black'} />
                ),
                tabBarLabel: 'Giỏ hàng',
              }}
            />
            <Tab.Screen
              name="Map" 
              component={MapScreen}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Entypo name="map" size={24} color={focused ? '#FF3366' : 'black'} />
                ),
                tabBarLabel: 'Map',
              }}
            />
            <Tab.Screen
              name="AccountStack"
              component={AccountStack}
              options={{
                tabBarIcon: ({ focused }) => (
                  <Entypo name="user" size={24} color={focused ? '#FF3366' : 'black'} />
                ),
                tabBarLabel: 'Tài khoản',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </CartProvider>
    </QueryClientProvider>
  );
}