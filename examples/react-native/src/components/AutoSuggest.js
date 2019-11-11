import * as React from 'react';
import { connect } from 'react-redux';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import { Container, Typography, Margin, Color } from '../styles';
import { setIsSearching } from '../redux/actions';

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

class AutoSuggest extends React.Component {
  state = {
    suggestions: [
      { suggestion: 'Brunet' },
      { suggestion: 'Jean Coutu' },
      { suggestion: 'Pharmaprix' },
    ],
  };

  onPress = record => {
    console.log(record.suggestion);

    this.props.setIsSearching(false);

    Keyboard.dismiss();
  };

  suggestion = record => (
    <TouchableOpacity
      onPress={() => this.onPress(record)}
      style={styles.suggestion}
    >
      <View style={styles.separator}>
        <Text style={Typography.Text}>{record.suggestion}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        data={this.state.suggestions}
        keyExtractor={record => record.suggestion}
        renderItem={record => this.suggestion(record.item)}
      />
    );
  }
}

export default connect(
  null,
  { setIsSearching }
)(AutoSuggest);
