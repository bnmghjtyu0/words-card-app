import {View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import {flexbox, space, border, color, typography} from 'styled-system';
export const RScontainer = styled.View`
  ${flexbox}
  width:100%;
  padding: 0 20px;
`;
export const RSrow = styled.View`
  ${flexbox}
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
`;
export const RsView = styled.View`
  ${flexbox}
  ${border}
  ${space}
`;
export const RsTouchableOpacity = styled.TouchableOpacity`
  ${flexbox}
  ${border}
`;
export const RsText = styled.Text`
  ${typography}
  ${color}
  ${space}
`;
export const RSBlock = styled(View)`
  ${flexbox}
  ${space}
  ${(props) => {
    if (props.col) {
      const width = (props.col / 12) * 100;
      return `width:${width}%`;
    }
  }}
  padding-left:15px;
  padding-right: 15px;
`;
