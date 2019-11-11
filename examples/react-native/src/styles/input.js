import { StyleSheet } from 'react-native';

import Radius from './radius';
import Color from './color';
import Margin from './margin';

export default StyleSheet.create({
  input: {
    backgroundColor: '#ECECED',
    color: Color.text,
    borderRadius: Radius.big,
    padding: Margin.small,
  },
});
