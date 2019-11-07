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
  input;
  state = {
    initialRefinement: undefined,
    query: null,
  };

  componentDidMount() {
    const { currentRefinement } = this.props;
    this.setState({
      query: currentRefinement,
      initialRefinement: currentRefinement,
    });
  }

  componentDidUpdate() {
    const { currentRefinement } = this.props;
    if (this.state.initialRefinement !== currentRefinement) {
      this.setState({
        query: currentRefinement,
        initialRefinement: currentRefinement,
      });
    }
  }

  onTextChange = text => {
    this.setState({ query: text });
  };

  onPress = () => {
    const { query } = this.state;

    this.props.refine(query);
    this.input.blur();
  };

  render() {
    const { toggleSearch } = this.props;
    return (
      <View style={Container.searchBox}>
        <TextInput
          value={this.state.query}
          style={styles.input}
          placeholder="Search a clinic, a speciality..."
          placeholderColor={Color.placeholder}
          blurOnSubmit={true}
          autoCorrect={false}
          returnKeyType="search"
          onChangeText={this.onTextChange}
          onFocus={() => toggleSearch(true)}
          onBlur={() => toggleSearch(false)}
          onSubmitEditing={this.onPress}
          ref={ref => {
            this.input = ref;
          }}
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
