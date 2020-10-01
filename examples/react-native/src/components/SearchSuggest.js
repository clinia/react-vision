import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { connectQuerySuggestions } from '@clinia/react-vizion-core';

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
    const { hits } = this.props;
    const results = hits.map(x => ({ text: x.query, option: x }));
    return <Suggestions results={results} onPress={this.onOptionSelected} />;
  }
}

export default compose(
  connect(
    null,
    { setSearchBoxFocused, setQuery }
  ),
  connectQuerySuggestions
)(SearchSuggest);
