import React, {Component} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  AppRegistry,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Swiper from 'react-native-deck-swiper';
import styled from 'styled-components';
import {flexbox, layout, typography} from 'styled-system';
// import {Button} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {TextInput, Snackbar} from 'react-native-paper';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import VideoPlayer from 'react-native-video-controls';
import {firebaseSuperior} from '../config/firebaseConfig';
import {client} from '../api/index';
import Toast from '../wrap/Toast';
const CoolRef = firebaseSuperior.ref('cool');
// CoolRef.remove();

const Container = styled.View`
  ${flexbox}
  padding: 0 20px;
`;

const Flex = styled.View`
  ${flexbox}
  ${layout}
`;

const InputSearch = () => {
  const [word, setWord] = React.useState('');
  const getAPI = async (word) => {
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
        CoolRef.push({
          dictionaryCode: res[0].dictionaryCode,
          entryId: res[0].entryId,
          pronunciationUrl: res[0].pronunciationUrl,
          lang: res[0].lang,
        });
      }
    }
  };
  return (
    <Flex flexDirection="row" flexGrow="1" alignItems="center">
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
    </Flex>
  );
};

const EnglishCard = () => {
  const [firebaseDatas, setFirebaseDatas] = React.useState([]);
  const [play, setPlay] = React.useState(false);
  const [wordNow, setWordNow] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  const _loadFirebase = () => {
    CoolRef.on('value', (snapshot) => {
      const ary = [];
      snapshot.forEach(function (item) {
        ary.push(item.val());
      });
      let deepCopyFirebase = [...ary];
      deepCopyFirebase.reverse();
      setFirebaseDatas(deepCopyFirebase);
    });
  };

  React.useEffect(() => {
    _loadFirebase();
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Flex flexGrow="1">
        <Container style={{marginTop: 40}}>
          <InputSearch />
        </Container>
        <Container style={{marginTop: 20}}>
          <FlatList
            data={firebaseDatas}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    marginBottom: 20,
                    backgroundColor: '#fff',
                    padding: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{marginRight: 'auto'}}>
                      <Text style={{fontSize: 20}}>{item.entryId}</Text>
                    </View>
                    <TouchableOpacity
                      style={{top: 2}}
                      onPress={() => onPlay(item)}>
                      <Ionicons name="ios-volume-high" size={30} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </Container>
        {play && renderVideo()}
      </Flex>
    </SafeAreaView>
  );
};

export default EnglishCard;
