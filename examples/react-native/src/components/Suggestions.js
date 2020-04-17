import * as React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { randomId } from '../helpers/utils';
import { Container, Typography, Margin, Color } from '../styles';

const styles = StyleSheet.create({
  separator: {
    paddingBottom: Margin.normal,
    borderBottomColor: Color.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestion: {
    ...Container.suggestion,
    paddingBottom: 0,
  },
});

class Suggestions extends React.Component {
  onPress = option => {
    const { onPress } = this.props;
    if (onPress) {
      onPress(option);
    }
  };

  suggestion = option => (
    <TouchableOpacity
      onPress={() => this.onPress(option)}
      style={styles.suggestion}
    >
      <View style={styles.separator}>
        <Text style={Typography.Text}>{option.text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { results } = this.props;
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        data={results}
        keyExtractor={() => randomId()}
        renderItem={hit => this.suggestion(hit.item)}
      />
    );
  }
}

export default Suggestions;
