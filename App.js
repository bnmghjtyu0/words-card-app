import React, {Component} from 'react';
import Swiper from 'react-native-deck-swiper';
import styled from 'styled-components';
import {flexbox, layout, typography} from 'styled-system';
import {TouchableOpacity, Text, View} from 'react-native';
import {firebaseSuperior} from './src/config/firebaseConfig';
const CoolRef = firebaseSuperior.ref('cool');

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

const Flex = styled.View`
  ${flexbox}
`;
const TextSystem = styled.Text`
  ${typography}
`;
const Box = styled.View`
  ${flexbox}
`;

const CardView = styled.View`
  background-color: #fff;
  display: flex;
  flex-grow: 0.45;
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

const CardDetailsView = styled.View`
  display: flex;
  flex-grow: 0.15;
  background-color: transparent;
`;
const Card = ({card}) => {
  return (
    <CardView>
      <TextSystem fontSize="40">{card.word}</TextSystem>
    </CardView>
  );
};

const CardDetails = ({index, swiperRef}) => {
  return (
    <CardDetailsView>
      {/* <Text>{cardDatas[index].price}</Text> */}

      <Flex flexDirection="row" flexWrap="nowrap">
        <Flex flexDirection="row" flexGrow="1" flex="0 0 50%">
          <Box width="100%" flexDirection="row" justifyContent="center">
            <ButtonStyle onPress={() => swiperRef.current.swipeLeft()}>
              <ButtonText>不會</ButtonText>
            </ButtonStyle>
          </Box>

          <Box width="100%" flexDirection="row" justifyContent="center">
            <ButtonStyle onPress={() => swiperRef.current.swipeRight()}>
              <ButtonText>會</ButtonText>
            </ButtonStyle>
          </Box>
        </Flex>
      </Flex>
    </CardDetailsView>
  );
};

const App = () => {
  const swiperRef = React.useRef(null);
  const [infinite, setInfinite] = React.useState(false);
  const [cardIndex, setCardIndex] = React.useState(0);
  const [firebaseDatas, setFirebaseDatas] = React.useState([]);
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

  console.log(firebaseDatas);

  return (
    <Flex flexGrow="1">
      <Flex flexGrow="1">
        {firebaseDatas.length ? (
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
            infinite
            // backgroundColor={'transparent'}
            disableTopSwipe
            disableBottomSwipe
            animateOverlayLabelsOpacity
            overlayLabels={{
              left: {
                title: '不會',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: '會',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
            }}>
            <TouchableOpacity
              onPress={() => swiperRef.swipeBack()}
              title="Swipe Back"
            />
          </Swiper>
        ) : null}
      </Flex>
      <CardDetails index={cardIndex} swiperRef={swiperRef} />
    </Flex>
  );
};

export default App;
