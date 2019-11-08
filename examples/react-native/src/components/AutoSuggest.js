import * as React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { withNavigation } from 'react-navigation';

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

class AutoSuggest extends React.Component {
  state = {
    suggestions: [
      { suggestion: 'Brunet' },
      { suggestion: 'Jean Coutu' },
      { suggestion: 'Pharmaprix' },
    ],
  };

  onPress = record => {
    const { navigation } = this.props;

    console.log(record.suggestion);

    const toggleSearch = navigation.getParam('toggleSearch');
    if (toggleSearch) {
      toggleSearch(false);
    }

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

export default withNavigation(AutoSuggest);
