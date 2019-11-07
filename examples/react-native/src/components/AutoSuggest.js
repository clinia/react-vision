import * as React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

import { Container, Typography, Margin } from '../styles';

class AutoSuggest extends React.Component {
  state = {
    suggestions: [
      { suggestion: 'Brunet' },
      { suggestion: 'Jean Coutu' },
      { suggestion: 'Pharmaprix' },
    ],
  };

  suggestion = record => (
    <View style={[Container.suggestion, { paddingBottom: 0 }]}>
      <View
        style={{
          paddingBottom: Margin.normal,
          borderBottomColor: '#E0E0E0',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Text style={Typography.Text}>{record.suggestion}</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={Container.suggestions}>
        <FlatList
          data={this.state.suggestions}
          keyExtractor={record => record.suggestion}
          renderItem={record => this.suggestion(record.item)}
        />
      </View>
    );
  }
}

export default AutoSuggest;
