import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { connectAutoComplete } from 'react-vision-core';

import Suggestions from './Suggestions';
import { setSuggestionMode, setQuery, setLocation } from '../redux/actions';
import SuggestionMode from '../redux/suggestionMode';

const mapStateToProps = state => ({
  suggestionMode: state.store.suggestionMode,
});

class AutoSuggest extends React.Component {
  onOptionSelected = option => {
    const { refine, suggestionMode } = this.props;

    if (suggestionMode === SuggestionMode.Query) {
      refine(option.text);
      this.props.setQuery(option.text);
    }

    // if (suggestionMode === SuggestionMode.Location) {
    // }

    this.props.setSuggestionMode(SuggestionMode.None);
    Keyboard.dismiss();
  };

  render() {
    const { suggestionMode, suggestions } = this.props;
    let results = [];
    switch (suggestionMode) {
      case SuggestionMode.Query:
        results = suggestions.map(x => ({ text: x.suggestion, option: x }));
        break;
      default:
        break;
    }
    return <Suggestions results={results} onPress={this.onOptionSelected} />;
  }
}

export default compose(
  connect(
    mapStateToProps,
    { setSuggestionMode, setQuery, setLocation }
  ),
  connectAutoComplete
)(AutoSuggest);
