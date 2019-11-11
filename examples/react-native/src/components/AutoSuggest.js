import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { connectAutoComplete } from 'react-vision-core';

import { randomId } from '../helpers/utils';
import { Container, Typography, Margin, Color } from '../styles';
import { setIsSearching, setQuery } from '../redux/actions';

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

const mapStateToProps = state => ({
  query: state.store.query,
});

class AutoSuggest extends React.Component {
  onPress = record => {
    const { refine } = this.props;

    refine(record.suggestion);
    this.props.setQuery(record.suggestion);
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
    const results = this.props.suggestions || [];
    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        data={results}
        keyExtractor={() => randomId()}
        renderItem={record => this.suggestion(record.item)}
      />
    );
  }
}

export default compose(
  connect(
    mapStateToProps,
    { setIsSearching, setQuery }
  ),
  connectAutoComplete
)(AutoSuggest);
