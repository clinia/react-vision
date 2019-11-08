import * as React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import { Container, Typography, Margin } from '../styles';

class AutoSuggest extends React.Component {
  state = {
    suggestions: [
      { suggestion: 'Brunet' },
      { suggestion: 'Jean Coutu' },
      { suggestion: 'Pharmaprix' },
    ],
  };

  onPress = record => {
    const { toggleSearch } = this.props;

    console.log(record.suggestion);

    if (toggleSearch) {
      toggleSearch(false);
    }

    Keyboard.dismiss();
  };

  suggestion = record => (
    <TouchableOpacity
      onPress={() => this.onPress(record)}
      style={[Container.suggestion, { paddingBottom: 0 }]}
    >
      <View
        style={{
          paddingBottom: Margin.normal,
          borderBottomColor: '#E0E0E0',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Text style={Typography.Text}>{record.suggestion}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={Container.suggestions}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.state.suggestions}
          keyExtractor={record => record.suggestion}
          renderItem={record => this.suggestion(record.item)}
        />
      </View>
    );
  }
}

export default AutoSuggest;
