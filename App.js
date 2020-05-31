import React, {Component} from 'react';
import Swiper from 'react-native-deck-swiper';
import styled from 'styled-components';
import {flexbox, layout, typography} from 'styled-system';
// import {Button} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {TouchableOpacity, Text, View} from 'react-native';
import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-controls';
import {firebaseSuperior} from './src/config/firebaseConfig';
import {client} from './src/api/index';
const CoolRef = firebaseSuperior.ref('cool');
// CoolRef.remove();
const cardDatas = [
  {
    word: 'apple',
  },
  {
    word: 'banana',
  },
  {
    word: 'watermelon',
  },
];

// cardDatas.map((v, i) => {
//   CoolRef.push({
//     word: v.word,
//   });
// });

const Container = styled.View`
  ${flexbox}
  padding: 0 20px;
`;

const Flex = styled.View`
  ${flexbox}
  ${layout}
`;
const TextSystem = styled.Text`
  ${typography}
`;
const Box = styled.View`
  ${flexbox}
`;

const CardView = styled.View`
  ${layout}
  background-color: #fff;
  display: flex;
  flex-grow: 0.25;
  justify-content: center;
  align-items: center;
  border-radius: 8;
  box-shadow: 0 0 #000;
  /* shadow-color: #000; 
  shadow-opacity: 0.08;
  shadow-offset: 0 0;  */
  shadow-radius: 25;
  shadow-opacity: 0.08;
`;
const ButtonStyle = styled.TouchableOpacity`
  ${layout}
  ${flexbox}
  border: 1px solid red;
  padding: 12px;
`;
const ButtonText = styled.Text`
  font-size: 20px;
`;

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
    CoolRef.push({
      dictionaryCode: res[0].dictionaryCode,
      entryId: res[0].entryId,
      pronunciationUrl: res[0].pronunciationUrl,
      lang: res[0].lang,
    });
  }
};
const Card = ({card}) => {
  return (
    <CardView width="60%" style={{marginLeft: 'auto', marginRight: 'auto'}}>
      <TextSystem fontSize="40">{card.entryId}</TextSystem>
    </CardView>
  );
};

const CardDetails = ({index, swiperRef, datas}) => {
  const [word, setWord] = React.useState('');
  const [pause, setPause] = React.useState(false);

  return (
    <Container flexGrow="1">
      <Flex style={{marginTop: 20}}>
        {datas.length !== 0 && (
          <Video
            source={{uri: datas[index].pronunciationUrl}}
            repeat={true}
            paused={pause}
            onEnd={() => {
              setPause(true);
            }}
          />
        )}
        <Flex flexDirection="row" style={{marginBottom: 20}}>
          <Button
            mode="contained"
            onPress={() => {
              setPause(false);
            }}
            style={{marginRight: 10}}>
            播放
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              swiperRef.current.swipeLeft();
            }}
            style={{marginRight: 10}}>
            prev
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              swiperRef.current.swipeRight();
            }}>
            next
          </Button>
        </Flex>
        {/* <Text>{cardDatas[index].price}</Text> */}
        {/* <Flex flexDirection="row" flexWrap="nowrap">
          <Flex flexDirection="row" flexGrow="1" justifyContent="center">
            <Box width="50%" flexDirection="row" justifyContent="center">
              <ButtonStyle onPress={() => swiperRef.current.swipeLeft()}>
                <ButtonText>不會</ButtonText>
              </ButtonStyle>
            </Box>

            <Box width="50%" flexDirection="row" justifyContent="center">
              <ButtonStyle onPress={() => swiperRef.current.swipeRight()}>
                <ButtonText>會</ButtonText>
              </ButtonStyle>
            </Box>
          </Flex>
        </Flex> */}

        <Flex flexDirection="row" flexGrow="1" alignItems="center">
          {/* <TextInput
            style={{
              width: '60%',
              marginBottom: 30,
              marginTop: 30,
              borderColor: 'lightgray',
              borderWidth: 1,
              height: 40,
              borderRadius: 6,
              marginRight: 20,
              paddingLeft: 12,
              fontSize: 15,
            }}
            label="123"
            value={word}
            onChangeText={(text) => setWord(text)}
          /> */}
          <TextInput
            mode="outlined"
            label="word"
            value={word}
            onChangeText={(text) => setWord(text)}
            style={{flex: 1, marginRight: 20}}
          />
          <Button
            mode="contained"
            onPress={() => {
              getAPI(word);
              setWord('');
            }}
            labelStyle={{fontSize: 20}}>
            <Text>送出</Text>
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

const App = () => {
  const swiperRef = React.useRef(null);
  const [infinite, setInfinite] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [firebaseDatas, setFirebaseDatas] = React.useState([]);
  const [pronunciationDatas, setPronunciationDatas] = React.useState([
    {dictionaryCode: '', entryId: '', pronunciationUrl: '', lang: ''},
  ]);
  const _loadFirebase = () => {
    CoolRef.on('value', (snapshot) => {
      const ary = [];
      snapshot.forEach(function (item) {
        ary.push(item.val());
      });
      let deepCopyFirebase = [...ary];
      deepCopyFirebase.reverse();
      // console.log(deepCopyFirebase);
      setFirebaseDatas(deepCopyFirebase);
    });
  };

  React.useEffect(() => {
    _loadFirebase();
  }, []);

  return (
    <Flex flexGrow="1">
      <Flex flexGrow="1" flexDirection="row" justifyContent="center">
        {firebaseDatas.length !== 0 ? (
          <Swiper
            ref={swiperRef}
            onSwiped={() => {
              setCardIndex((cardIndex + 1) % firebaseDatas.length);
            }}
            cards={firebaseDatas}
            cardIndex={cardIndex}
            renderCard={(card, index) => {
              return <Card card={card} />;
            }}
            stackSize={4}
            stackScale={10}
            stackSeparation={14}
            infinite={true}
            // backgroundColor={'transparent'}
            disableTopSwipe
            disableBottomSwipe
            animateOverlayLabelsOpacity
            // overlayLabels={{
            //   left: {
            //     title: '不會',
            //     style: {
            //       label: {
            //         backgroundColor: 'black',
            //         borderColor: 'black',
            //         color: 'white',
            //         borderWidth: 1,
            //       },
            //       wrapper: {
            //         flexDirection: 'column',
            //         alignItems: 'flex-end',
            //         justifyContent: 'flex-start',
            //         marginTop: 30,
            //         marginLeft: -30,
            //       },
            //     },
            //   },
            //   right: {
            //     title: '會',
            //     style: {
            //       label: {
            //         backgroundColor: 'black',
            //         borderColor: 'black',
            //         color: 'white',
            //         borderWidth: 1,
            //       },
            //       wrapper: {
            //         flexDirection: 'column',
            //         alignItems: 'flex-start',
            //         justifyContent: 'flex-start',
            //         marginTop: 30,
            //         marginLeft: 30,
            //       },
            //     },
            //   },
            // }}
          >
            <TouchableOpacity
              onPress={() => swiperRef.swipeBack()}
              title="Swipe Back"
            />
          </Swiper>
        ) : null}
      </Flex>
      <CardDetails
        index={cardIndex}
        swiperRef={swiperRef}
        datas={firebaseDatas}
      />
    </Flex>
  );
};

export default App;
