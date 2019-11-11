import { StyleSheet } from 'react-native';

import Color from './color';

export default StyleSheet.create({
  title: {
    color: Color.title,
    fontSize: 17,
    fontWeight: '600',
  },
  text: {
    color: Color.subtitle,
    fontSize: 15,
  },
  subText: {
    color: Color.subtitle,
    fontSize: 12,
  },
});
