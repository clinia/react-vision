import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { TextInput, StyleSheet } from 'react-native';
import { connectQuerySuggestions } from '@clinia/react-vizion-core';
import { withNavigation } from 'react-navigation';

import { setQuery, setSearchBoxFocused } from '../redux/actions';
import { Input, Color, Margin } from '../styles';

const styles = StyleSheet.create({
  input: {
    ...Input.input,
    flexGrow: 1,
    width: 325,
    marginTop: 8,
    marginLeft: Margin.normal,
    marginRight: Margin.normal,
  },
});

const mapStateToProps = state => ({
  query: state.store.query,
});

class SearchBox extends React.Component {
  input;
  listeners = [];

  state = {
    value: '',
  };

  componentDidUpdate(prevProps) {
    if (this.props.currentRefinement !== prevProps.currentRefinement) {
      this.setState({ value: this.props.currentRefinement });
    }
  }

  componentDidMount() {
    this.listeners = [
      this.props.navigation.addListener('willBlur', () => {
        const { refine } = this.props;
        refine();
      }),
      this.props.navigation.addListener('willFocus', () => {
        const { refine, query } = this.props;
        refine(query);
      }),
    ];
  }

  componentWillUnmount() {
    this.listeners.forEach(x => x.remove());
  }

  onTextChange = text => {
    this.setState({ value: text });
    this.props.searchForQuerySuggestions(text);
  };

  onPress = ({ nativeEvent: { text } }) => {
    this.props.refine(text);

    this.toggleSearch(false);
  };

  toggleSearch = isFocused => {
    this.props.setSearchBoxFocused(isFocused);
  };

  render() {
    return (
      <TextInput
        value={this.state.value}
        style={styles.input}
        placeholder="Search a clinic, a speciality..."
        placeholderColor={Color.placeholder}
        autoCorrect={false}
        returnKeyType="search"
        onChangeText={this.onTextChange}
        onFocus={() => {
          this.toggleSearch(true);
        }}
        onBlur={() => {
          this.toggleSearch(false);
        }}
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
  withNavigation,
  connectQuerySuggestions
)(SearchBox);
