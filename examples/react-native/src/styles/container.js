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
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.navigationBarAccent,
    backgroundColor: Color.navigationBarBackground,
    paddingTop: Margin.appTop,
    paddingLeft: Margin.normal,
    paddingRight: Margin.normal,
    paddingBottom: Margin.normal,
  },
  hits: {
    paddingLeft: Margin.normal,
    paddingRight: Margin.normal,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  hit: {
    borderRadius: Radius.normal,
    marginTop: Margin.normal,
    padding: Margin.normal,
    backgroundColor: 'white',
  },
  suggestions: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  suggestion: {
    paddingTop: Margin.normal,
    paddingLeft: Margin.normal,
    paddingBottom: Margin.normal,
    backgroundColor: 'white',
  },
});
