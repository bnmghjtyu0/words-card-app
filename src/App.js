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
import {SvgCss} from 'react-native-svg';

const xml = (obj) =>
  `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="${obj.color}"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-film">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
`;

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
                return (
                  <SvgCss
                    xml={xml({
                      color: `${(iconName = focused ? 'tomato' : 'gray')}`,
                    })}
                  />
                );
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
