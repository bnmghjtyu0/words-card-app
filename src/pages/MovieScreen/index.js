import React from 'react';
import {
  View,
  ScrollView,
  Text,
  FlatList,
  RefreshControl,
  Button,
  Dimensions,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Toast from '../../wrap/Toast';
import {clientMovie} from '../../api/index';
import {wait} from '../../lib/config';
import TabsProvider, {TabsContext, withContext} from './context/TabsContext';
import {RsView, RsText, RsBlock, RsTouchableOpacity} from '../../styled/main';
const Tab = createMaterialTopTabNavigator();

const HomeScreen = () => {
  const [lang, setLang] = React.useContext(TabsContext);
  const [moviesDatas, setMoviesDatas] = React.useState({
    dates: {minimum: '', maximum: '', results: []},
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    (id) => {
      console.log(id);
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );

  const fetchMovies = () => {
    clientMovie('movie/now_playing', '&language=zh-TW&page=1')
      .then((res) => {
        if (res.ok) {
          Toast.show('已更新');
          return res.json();
        }
        Toast.show('api 失敗');
      })
      .then((json) => {
        setMoviesDatas(json);
      });
  };
  React.useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMovies();
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  // console.log(moviesDatas);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <RsView p={[20, 0]} flexDirection="row" justifyContent="center">
        <RsText>{moviesDatas.dates.minimum}</RsText>
        <RsText mx={10}>~</RsText>
        <RsText>{moviesDatas.dates.maximum}</RsText>
      </RsView>
      <FlatList
        data={moviesDatas.results}
        renderItem={({item}) => (
          <RsTouchableOpacity
            activeOpacity={0.75}
            flexDirection="row"
            border="0.5px solid"
            borderColor="black"
            onPress={() => onSelect(item.id)}>
            <Image
              style={{width: 120, height: 200}}
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
              }}
            />
            <RsView padding={20}>
              <RsText fontSize={24} color="black">
                {item.title}
              </RsText>
              <RsText fontSize={14} color="black">
                {item.vote_average}
              </RsText>
            </RsView>
          </RsTouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        extraData={selected}
      />
    </ScrollView>
  );
};

const SettingsScreen = () => {
  const [lang, setLang] = React.useContext(TabsContext);
  const [moviesDatas, setMoviesDatas] = React.useState({
    dates: {minimum: '', maximum: '', results: []},
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    (id) => {
      console.log(id);
      const newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));

      setSelected(newSelected);
    },
    [selected],
  );

  const fetchMovies = () => {
    clientMovie('movie/popular', '&language=zh-TW&page=1')
      .then((res) => {
        if (res.ok) {
          Toast.show('已更新');
          return res.json();
        }
        Toast.show('api 失敗');
      })
      .then((json) => {
        setMoviesDatas(json);
      });
  };
  React.useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMovies();
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  // console.log(moviesDatas);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <RsView p={[20, 0]} flexDirection="row" justifyContent="center">
        {/* <RsText>{moviesDatas.dates.minimum}</RsText>
        <RsText mx={10}>~</RsText>
        <RsText>{moviesDatas.dates.maximum}</RsText> */}
      </RsView>
      <FlatList
        data={moviesDatas.results}
        renderItem={({item}) => (
          <RsTouchableOpacity
            activeOpacity={0.75}
            flexDirection="row"
            border="0.5px solid"
            borderColor="black"
            onPress={() => onSelect(item.id)}>
            <Image
              style={{width: 120, height: 200}}
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
              }}
            />
            <RsView padding={20}>
              <RsText fontSize={24} color="black">
                {item.title}
              </RsText>
              <RsText fontSize={14} color="black">
                {item.vote_average}
              </RsText>
              <RsText fontSize={14} color="black">
                {item.release_date}
              </RsText>
            </RsView>
          </RsTouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        extraData={selected}
      />
    </ScrollView>
  );
};

function MyTabBar({state, descriptors, navigation, position}) {
  const totalWidth = Dimensions.get('window').width;
  const tabWidth = totalWidth / state.routes.length;
  const [translateValue] = React.useState(new Animated.Value(0));
  return (
    <View style={{flexDirection: 'row'}}>
      <Animated.View
        style={[
          {
            height: 3,
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: '#E94F11',
            borderRadius: 0,
          },
          {
            transform: [{translateX: translateValue}],
            width: tabWidth - 60,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
            Animated.spring(translateValue, {
              toValue: index * tabWidth,
              velocity: 40,
              useNativeDriver: true,
            }).start();
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        if (isFocused) {
          Animated.spring(translateValue, {
            toValue: index * tabWidth,
            velocity: 40,
            useNativeDriver: true,
          }).start();
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, padding: 20}}>
              <Text>{label}</Text>
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, padding: 20}}>
              <Text>{label}</Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
}

const Other = ({navigation}) => {
  const [lang, setLang] = React.useContext(TabsContext);
  navigation.setOptions({
    headerTitle: lang === 'tw' ? '電影看板' : 'Movie Board',
    headerTitleAlign: 'center',
    headerRight: ({tintColor}) => (
      <View style={{paddingRight: 20, flexDirection: 'row'}}>
        <Button
          title="tw"
          onPress={() => {
            setLang('tw');
          }}>
          {lang}
        </Button>
        <Button
          title="en"
          onPress={() => {
            setLang('en');
          }}>
          {lang}
        </Button>
      </View>
    ),
  });
  return (
    <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name={lang === 'tw' ? '本週新片' : 'New'}
        component={HomeScreen}
      />
      <Tab.Screen
        name={lang === 'tw' ? '排行榜' : 'Setting'}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export default withContext(Other);
