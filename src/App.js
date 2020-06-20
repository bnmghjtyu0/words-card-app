import * as React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';
import CategoryScreen from './pages/Category';
import MovieScreen from './pages/MovieScreen';
import EnglishCard from './pages/EnglishCard';

const AppStack = createStackNavigator();

function MovieStackScreen() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Other"
        component={MovieScreen}
        options={({route}) => ({
          headerStyle: {
            backgroundColor: 'tomato',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />
    </AppStack.Navigator>
  );
}

function EnglishCardStackScreen() {
  return (
    <AppStack.Navigator headerMode="none">
      <AppStack.Screen name="EnglishCard" component={EnglishCard} />
    </AppStack.Navigator>
  );
}
function CategoryStackScreen() {
  return (
    <AppStack.Navigator headerMode="none">
      <AppStack.Screen name="Category" component={CategoryScreen} />
    </AppStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Search') {
                iconName = focused ? 'ios-search' : 'ios-search';
              } else if (route.name === 'Movie') {
                iconName = focused ? 'ios-list-box' : 'ios-list';
              } else if (route.name === 'Category') {
                iconName = focused ? 'ios-albums' : 'ios-albums';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Category" component={CategoryStackScreen} />
          <Tab.Screen name="Search" component={EnglishCardStackScreen} />
          <Tab.Screen name="Movie" component={MovieStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
