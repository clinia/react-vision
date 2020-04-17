import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { connectAutoComplete } from '@clinia/react-vision-core';

import Suggestions from './Suggestions';
import { setSearchBoxFocused, setQuery } from '../redux/actions';

class SearchSuggest extends React.Component {
  onOptionSelected = option => {
    const { refine } = this.props;

    refine(option.text);
    this.props.setQuery(option.text);

    this.props.setSearchBoxFocused(false);
    Keyboard.dismiss();
  };

  render() {
    const { suggestions } = this.props;
    const results = suggestions.map(x => ({ text: x.suggestion, option: x }));
    return <Suggestions results={results} onPress={this.onOptionSelected} />;
  }
}

export default compose(
  connect(
    null,
    { setSearchBoxFocused, setQuery }
  ),
  connectAutoComplete
)(SearchSuggest);
