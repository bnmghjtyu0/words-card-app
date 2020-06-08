import {View} from 'react-native';
import styled from 'styled-components';
import {flexbox,space} from 'styled-system';
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
