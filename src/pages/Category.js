import React from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Button, TextInput} from 'react-native-paper';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {client} from '../api/index';
import {RScontainer, RSrow, RSBlock} from '../styled/main';
import {firebaseSuperior} from '../config/firebaseConfig';
import Toast from '../wrap/Toast';
import {ScrollView} from 'react-native-gesture-handler';
const ClothesRef = firebaseSuperior.ref('clothes');

const CategoryScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: 'Other',
    headerTitleAlign: 'center',
  });

  const [firebaseDatas, setFirebaseDatas] = React.useState([]);
  const [word, setWord] = React.useState('');
  const [wordNow, setWordNow] = React.useState({});
  const [play, setPlay] = React.useState(false);
  const getCambridge = async (word) => {
    const wordLower = word.toLowerCase();
    if (wordLower !== '') {
      const entryId = wordLower; //grooming
      const dictCode = 'british';
      const res = await client(
        `https://dictionary.cambridge.org/api/v1/dictionaries/${dictCode}/entries/${entryId}/pronunciations`,
        {
          body: {},
          params: {
            lang: 'us',
            format: 'mp3',
          },
        },
      );
      if (res?.errorCode) {
        Toast.show('api 錯誤');
      } else {
        console.log('correct');
        ClothesRef.push({
          dictionaryCode: res[0].dictionaryCode,
          entryId: res[0].entryId,
          pronunciationUrl: res[0].pronunciationUrl,
          lang: res[0].lang,
        });
      }
    }
  };

  const updateUnsplashImage = (ary) => {
    ary.map((v, i) => {
      const id = v.id;
      const word = v.entryId;
      getUnsplashImage(id, word, v);
    });
  };

  const getUnsplashImage = async (id, word, v) => {
    fetch(
      `https://api.unsplash.com/search/photos?client_id=4070052047e85343f77f7bbfb056ca4da387e25b3114baff0644247779a29964&query=${word}`,
    )
      .then((res) => res.json())
      .then((json) => {
        firebaseSuperior.ref('clothes/' + id).set({
          ...v,
          image: json.results[0].urls.small,
        });
      });
  };
  const _loadFirebase = () => {
    ClothesRef.on('value', (snapshot) => {
      const ary = [];
      snapshot.forEach(function (item) {
        ary.push({id: item.key, ...item.val()});
      });
      let deepCopyFirebase = [...ary];
      deepCopyFirebase.reverse();
      setFirebaseDatas(deepCopyFirebase);
    });
  };
  React.useEffect(() => {
    _loadFirebase();
    // getCambridge();
  }, []);

  const renderVideo = () => {
    return (
      <Video
        source={{uri: wordNow.pronunciationUrl}}
        onEnd={() => setPlay(false)}
      />
    );
  };

  const onPlay = (item) => {
    setPlay(true);
    setWordNow(item);
  };

  const InputSearch = () => {
    const [word, setWord] = React.useState('');
    const getAPI = async (word) => {
      const wordLower = word.toLowerCase();
      if (wordLower !== '') {
        getCambridge(word);
      }
    };
    return (
      <RScontainer flexDirection="row" flexGrow="1" alignItems="center">
        <TextInput
          mode="outlined"
          label="word"
          value={word}
          onChangeText={(text) => setWord(text)}
          style={{flex: 1, marginRight: 20, height: 40}}
          underlineColorAndroid="transparent"
          // 鍵盤
          keyboardType="default"
          keyboardShouldPersistTaps="always"
        />
        <Button
          mode="contained"
          onPress={() => {
            getAPI(word);
            setWord('');
          }}
          labelStyle={{fontSize: 10}}>
          <Text style={{fontSize: 15}}>送出</Text>
        </Button>
      </RScontainer>
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
      <InputSearch />
      <ScrollView style={{marginTop: 20}}>
        <RScontainer>
          <TouchableOpacity
            style={{marginBottom: 20}}
            onPress={() => updateUnsplashImage(firebaseDatas)}>
            <Text>更新圖片</Text>
          </TouchableOpacity>
          <RSrow>
            {firebaseDatas.map((data, dataIdx) => {
              console.log(data);
              return (
                <RSBlock key={data.id} col={6} mb={30}>
                  <Card onPress={() => onPlay(data)}>
                    <Image
                      source={{uri: data.image}}
                      style={{width: '100%', height: 200}}
                    />
                    <View
                      style={{
                        justifyContent: 'center',
                        flexDirection: 'row',
                        paddingVertical: 20,
                      }}>
                      <Text style={{fontSize: 22, marginRight: 10}}>
                        {data.entryId}
                      </Text>

                      <TouchableOpacity
                      //   onPress={() => onPlay(data)}
                      >
                        <Ionicons
                          name="ios-volume-high"
                          size={30}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {/* <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                  </Card.Actions> */}
                  </Card>
                </RSBlock>
              );
            })}
          </RSrow>
        </RScontainer>
      </ScrollView>
      {play && renderVideo()}
    </SafeAreaView>
  );
};

export default CategoryScreen;
