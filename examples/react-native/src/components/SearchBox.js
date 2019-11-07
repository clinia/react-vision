/* eslint-disable no-console */
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { connectSearchBox } from 'react-vision-native';

import { Container, Buttons, Input, Color, Margin } from '../styles';

const styles = StyleSheet.create({
  input: {
    ...Input.input,
    flexGrow: 1,
    marginRight: Margin.normal,
  },
});

class SearchBox extends React.Component {
  state = {
    query: null,
  };

  onTextChange = text => {
    this.setState({ query: text });
  };

  onPress = () => {
    const { query } = this.state;
    this.props.refine(query);
  };

  render() {
    return (
      <View style={Container.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Search a clinic, a speciality..."
          placeholderColor={Color.placeholder}
          onChangeText={this.onTextChange}
          value={this.state.query}
        />
        <Button
          onPress={this.onPress}
          title="Search"
          accessibilityLabel="Search"
          style={Buttons.primary}
        />
      </View>
    );
  }
}

export default connectSearchBox(SearchBox);
