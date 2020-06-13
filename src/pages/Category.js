import React from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Card, Button, TextInput} from 'react-native-paper';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {client} from '../api/index';
import {RScontainer, RSrow, RSBlock} from '../styled/main';
import {firebaseSuperior, firebaseDB} from '../config/firebaseConfig';
import Toast from '../wrap/Toast';
import {ScrollView} from 'react-native-gesture-handler';
import SwipeablePanel from 'rn-swipeable-panel';
const CategoryRef = firebaseSuperior.ref('category');
const CategoryClothesRef = CategoryRef.child('clothes');

const CategoryScreen = ({navigation}) => {
  navigation.setOptions({
    headerTitle: 'Other',
    headerTitleAlign: 'center',
  });
  const [swipeablePanelActive, setSwipeablePanelActive] = React.useState(false);
  const [firebaseDatas, setFirebaseDatas] = React.useState([]);
  const [word, setWord] = React.useState('');
  const [wordNow, setWordNow] = React.useState({});
  const [play, setPlay] = React.useState(false);
  const [changePicktureDatas, setChangePicktureDatas] = React.useState([]);
  const [clickedWord, setClickedWord] = React.useState({});
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
        Toast.show(res?.errorCode);
      } else {
        console.log('correct');
        CategoryClothesRef.push({
          dictionaryCode: res[0].dictionaryCode,
          entryId: res[0].entryId,
          pronunciationUrl: res[0].pronunciationUrl,
          lang: res[0].lang,
        });
      }
    }
  };

  const setUnsplashAPI = async (word) => {
    const res = await getUnsplashImage(word);
    CategoryClothesRef.push({
      entryId: decodeURIComponent(word),
      image: res.results[0].urls.small,
    });
  };
  const updateUnsplashImage = (ary) => {
    ary.map(async (v, i) => {
      const word = v.entryId;
      const res = await getUnsplashImage(word);
      updateClothesRef(v, res.results);
    });
  };

  const updateClothesRef = (val, data) => {
    firebaseSuperior.ref('category/clothes/' + val.id).set({
      ...val,
      image: data[0].urls.small,
    });
  };
  const getUnsplashImage = async (word) => {
    return fetch(
      `https://api.unsplash.com/search/photos?client_id=4070052047e85343f77f7bbfb056ca4da387e25b3114baff0644247779a29964&query=${word}`,
    )
      .then((res) => res.json())
      .then((json) => Promise.resolve(json));
  };
  const _loadFirebase = () => {
    CategoryClothesRef.on('value', (snapshot) => {
      const ary = [];
      snapshot.forEach(function (item) {
        ary.push({id: item.key, ...item.val()});
      });
      let deepCopyFirebase = [...ary];
      deepCopyFirebase.reverse();
      setFirebaseDatas(deepCopyFirebase);
    });
  };

  const _loadFirestore = () => {
    // var firebaseDB = firebase.firestore();
    // set firebaseDB.collection('').doc('').set({})
    // add collection('').doc('').add({})
    // get collection('').get().then((querySnapshot)=>{querySnapshot.forEach((doc)=>console.log(doc))})
    // del collection('').doc('').delete().then(function(){console.log('success')})

    // add('apple')
    const add = (word) => {
      const docUserRegular = firebaseDB.collection('cagegory').doc('clothes');
      docUserRegular.get().then(async (doc) => {
        if (doc.exists) {
          const res = await doc.data();
          if (Object.keys(res).length === 0) {
            const datas = {
              word: word,
            };
            docUserRegular.set({items: [datas]}, {merge: true});
          } else {
            const wordExists = res.items.filter((data) => data.word === word);
            if (wordExists.length !== 0) {
            } else {
              const datas = {
                word: word,
              };
              docUserRegular.set({items: [...res.items, datas]}, {merge: true});
            }
          }
        } else {
          console.log('No such document!');
        }
      });
    };
    add('banafna');
    // const query = firebaseDB
    //   .collection('cagegory')
    //   .where('clothes', 'array-contains', 'sharedWith');
    // console.log('query', query);
    const get = () => {
      const docUserRegular = firebaseDB.collection('cagegory').doc('clothes');
      docUserRegular.get().then(function (doc) {
        console.log(doc.data());
      });
    };
  };
  React.useEffect(() => {
    _loadFirebase();
    _loadFirestore();
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
    const getCambridgeAPI = async (word) => {
      const wordLower = encodeURIComponent(word.toLowerCase().trim());
      if (wordLower !== '') {
        getCambridge(wordLower);
      }
    };
    const getUnsplashAPI = async (word) => {
      const wordLower = encodeURIComponent(word.toLowerCase().trim());
      if (wordLower !== '') {
        setUnsplashAPI(wordLower);
      }
    };
    return (
      <RScontainer flexDirection="row" flexGrow="1" alignItems="flex-start">
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
            getCambridgeAPI(word);
            setWord('');
          }}
          labelStyle={{fontSize: 10}}>
          <Text style={{fontSize: 15}}>送出</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            getUnsplashAPI(word);
            setWord('');
          }}
          labelStyle={{fontSize: 10}}>
          <Text style={{fontSize: 15}}>送出圖片</Text>
        </Button>
      </RScontainer>
    );
  };

  const changePicture = async (data) => {
    const imgData = await getUnsplashImage(data.entryId);
    console.log(imgData);
    setChangePicktureDatas(imgData.results);
    // const getUnsplashAPI = async (word) => {
    //   const wordLower = encodeURIComponent(word.toLowerCase().trim());
    //   if (wordLower !== '') {
    //     setUnsplashAPI(wordLower);
    //   }
    // };

    // const updateClothesRef = (val, data) => {
    //   firebaseSuperior.ref('category/clothes/' + val.id).set({
    //     ...val,
    //     image: data[0].urls.small,
    //   });
    // };
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
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
                      {data.pronunciationUrl && (
                        <TouchableOpacity
                        //   onPress={() => onPlay(data)}
                        >
                          <Ionicons
                            name="ios-volume-high"
                            size={30}
                            color="#666"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: '80%',
                      left: '10%',
                      zIndex: -1,
                      paddingVertical: 20,
                      paddingHorizontal: 20,
                    }}>
                    <Button
                      mode="contained"
                      color="green"
                      onPress={() => {
                        setSwipeablePanelActive(true);
                        changePicture(data);
                        setClickedWord(data);
                      }}>
                      <Text>換圖</Text>
                    </Button>
                  </View>
                </RSBlock>
              );
            })}
          </RSrow>
        </RScontainer>
      </ScrollView>
      <SwipeablePanel
        fullWidth
        isActive={swipeablePanelActive}
        onClose={() => {
          setSwipeablePanelActive(false);
        }}
        onPressCloseButton={() => {
          setSwipeablePanelActive(false);
        }}>
        <RScontainer>
          <TouchableOpacity
            onPress={() => {
              setSwipeablePanelActive(false);
            }}>
            <Text>關閉</Text>
          </TouchableOpacity>
          <RSrow>
            {changePicktureDatas.length !== 0 &&
              changePicktureDatas.map((data, dataIdx) => {
                return (
                  <RSBlock key={data.id} col={6} mb={30}>
                    <Card
                      onPress={() => {
                        const updateClothesRef = (val, data) => {
                          firebaseSuperior
                            .ref('category/clothes/' + val.id)
                            .set({
                              ...val,
                              image: data.urls.small,
                            });
                        };
                        updateClothesRef(clickedWord, data);
                        setSwipeablePanelActive(false);
                      }}>
                      <Image
                        source={{uri: data.urls.regular}}
                        style={{width: '100%', height: 200}}
                      />
                    </Card>
                  </RSBlock>
                );
              })}
          </RSrow>
        </RScontainer>
      </SwipeablePanel>
      {play && renderVideo()}
    </SafeAreaView>
  );
};

export default CategoryScreen;
