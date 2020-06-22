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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{flex: 1, backgroundColor: 'rgba(60,97,249,1)'}}
        />
      }>
      {/* <RsView p={[20, 0]} flexDirection="row" justifyContent="center">
        <RsText>{moviesDatas.dates.minimum}</RsText>
        <RsText mx={10}>~</RsText>
        <RsText>{moviesDatas.dates.maximum}</RsText>
      </RsView> */}
      <FlatList
        style={{backgroundColor: 'rgba(60,97,249,1)'}}
        data={moviesDatas.results}
        renderItem={({item}) => (
          <RsTouchableOpacity
            activeOpacity={0.75}
            flexDirection="row"
            borderColor="black"
            style={{marginBottom: 20, backgroundColor: '#fff', borderRadius: 6}}
            onPress={() => onSelect(item.id)}>
            <Image
              style={{
                width: 80,
                height: 120,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
              }}
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
              }}
            />
            <RsView padding={20} style={{position: 'relative', width: '100%'}}>
              <RsText fontSize={18} color="black">
                {item.title}
              </RsText>
              <RsView
                style={{
                  position: 'absolute',
                  right: 90,
                  top: 10,
                  backgroundColor: 'rgba(60,97,249,1)',
                  width: 42,
                  height: 42,
                  borderRadius: 99,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <RsText fontSize={14} color="#fff">
                  {`${item.vote_average * 10}%`}
                </RsText>
              </RsView>
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{flex: 1, backgroundColor: 'rgba(60,97,249,1)'}}
        />
      }>
      <FlatList
        style={{backgroundColor: 'rgba(60,97,249,1)'}}
        data={moviesDatas.results}
        renderItem={({item}) => (
          <RsTouchableOpacity
            activeOpacity={0.75}
            flexDirection="row"
            borderColor="black"
            style={{marginBottom: 20, backgroundColor: '#fff', borderRadius: 6}}
            onPress={() => onSelect(item.id)}>
            <Image
              style={{
                width: 80,
                height: 120,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
              }}
              source={{
                uri: `https://image.tmdb.org/t/p/w500/${item.poster_path}`,
              }}
            />
            <RsView padding={20} style={{position: 'relative', width: '100%'}}>
              <RsText fontSize={18} color="black">
                {item.title}
              </RsText>
              <RsView
                style={{
                  position: 'absolute',
                  right: 90,
                  top: 10,
                  backgroundColor: 'rgba(60,97,249,1)',
                  width: 42,
                  height: 42,
                  borderRadius: 99,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <RsText fontSize={14} color="#fff">
                  {`${item.vote_average * 10}%`}
                </RsText>
              </RsView>
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
    <View
      style={{
        flexDirection: 'row',
        padding: 0,
        backgroundColor: 'rgba(255,255,255,.4)',
        borderRadius: 25,
        marginTop: 30,
        marginBottom: 50,
      }}>
      <Animated.View
        style={[
          {
            width:'100%',
            height: 50,
            position: 'absolute',
            left: 0,
            backgroundColor: '#fff',
            borderRadius: 25,
          },
          {
            transform: [{translateX: translateValue}],
            width: tabWidth,
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
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderRadius: 25,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{fontSize: 15}}>{label}</Text>
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
              style={{
                flex: 1,
                height: 50,
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderRadius: 25,
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text style={{color: '#fff', fontSize: 15}}>{label}</Text>
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
    headerStyle: {
      backgroundColor: 'rgba(60,97,249,1)',
      border: 'none',
    },
    headerTitle: lang === 'tw' ? '電影看板' : 'Movie Board',
    headerTitleAlign: 'center',
    headerRight: ({tintColor}) => (
      <View style={{paddingRight: 20, flexDirection: 'row'}}>
        <Button
          title="tw"
          color="#fff"
          onPress={() => {
            setLang('tw');
          }}>
          {lang}
        </Button>
        <Button
          title="en"
          color="#fff"
          onPress={() => {
            setLang('en');
          }}>
          {lang}
        </Button>
      </View>
    ),
  });
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(60,97,249,1)',
        paddingHorizontal: 20,
      }}>
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
    </View>
  );
};

export default withContext(Other);
