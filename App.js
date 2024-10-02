import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false, tabBarActiveTintColor: 'blue'
      }}>
        <Tab.Screen name="Home" component={HomeScreen} 
        options={{tabBarIcon:()=><Entypo name="home" size={24} color="black" />}}/>
        <Tab.Screen name="Reorder" component={HomeScreen} 
        options={{tabBarIcon:()=><Entypo name="list" size={24} color="black" />}}/>
        <Tab.Screen name="Cart" component={HomeScreen} 
        options={{tabBarIcon:()=><Entypo name="shopping-cart" size={24} color="black" />}}/>
        <Tab.Screen name="Account" component={HomeScreen} 
        options={{tabBarIcon:()=><Entypo name="user" size={24} color="black" />}}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}