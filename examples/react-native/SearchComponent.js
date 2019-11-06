/* eslint-disable no-console */
import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { connectSearchBox } from 'react-vision-native';

class SearchComponent extends React.Component {
  state = {
    query: null,
  };

  onTextChange = text => {
    console.log(text);
    this.setState({ query: text });
  };

  onPress = () => {
    const { query } = this.state;
    console.log(query);
    this.props.refine(query);
  };

  render() {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <TextInput
          style={{
            flexGrow: 1,
            height: 40,
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
          }}
          placeholder="Type here to translate!"
          onChangeText={this.onTextChange}
          value={this.state.query}
        />
        <Button
          onPress={this.onPress}
          title="Search"
          style={{ height: 40, borderRadius: 5, paddingLeft: 16 }}
        />
      </View>
    );
  }
}

export default connectSearchBox(SearchComponent);
