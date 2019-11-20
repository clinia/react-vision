import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TextInput, StyleSheet } from 'react-native';
import { connectAutoComplete } from 'react-vision-core';

import { setQuery, setSearchBoxFocused } from '../redux/actions';
import { Input, Color, Margin } from '../styles';

const styles = StyleSheet.create({
  input: {
    ...Input.input,
    flexGrow: 1,
    marginLeft: Margin.normal,
    marginRight: Margin.normal,
  },
});

const mapStateToProps = state => ({
  query: state.store.query,
});

class SearchBox extends React.Component {
  input;

  onTextChange = text => {
    const { searchForSuggestions } = this.props;
    searchForSuggestions(text);
    this.props.setQuery(text);
  };

  onPress = () => {
    const { query } = this.props;

    this.props.refine(query);
    this.input.blur();

    this.toggleSearch(false);
  };

  toggleSearch = isFocused => this.props.setSearchBoxFocused(isFocused);

  render() {
    const { query } = this.props;
    return (
      <TextInput
        value={query}
        style={styles.input}
        placeholder="Search a clinic, a speciality..."
        placeholderColor={Color.placeholder}
        autoCorrect={false}
        returnKeyType="search"
        onChangeText={this.onTextChange}
        onFocus={() => this.toggleSearch(true)}
        onBlur={() => this.toggleSearch(false)}
        onSubmitEditing={this.onPress}
        ref={ref => {
          this.input = ref;
        }}
      />
    );
  }
}

export default compose(
  connect(
    mapStateToProps,
    { setQuery, setSearchBoxFocused }
  ),
  connectAutoComplete
)(SearchBox);
