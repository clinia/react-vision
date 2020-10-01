import { StyleSheet } from 'react-native';

import Radius from './radius';
import Color from './color';
import Margin from './margin';

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Color.background,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    height: 100,
    width: '100%',
  },
  hit: {
    marginLeft: Margin.normal,
    marginRight: Margin.normal,
    borderRadius: Radius.normal,
    marginTop: Margin.normal,
    padding: Margin.normal,
    backgroundColor: 'white',
  },
  suggestion: {
    paddingTop: Margin.normal,
    paddingLeft: Margin.normal,
    paddingBottom: Margin.normal,
    backgroundColor: 'white',
  },
});
