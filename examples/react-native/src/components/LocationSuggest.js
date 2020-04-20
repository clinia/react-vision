import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { connectLocation } from '@clinia/react-vizion-core';

import Suggestions from './Suggestions';
import { setLocationBoxFocused, setLocation } from '../redux/actions';

class SearchSuggest extends React.Component {
  onOptionSelected = option => {
    const { refine } = this.props;

    refine(option.text);
    this.props.setLocation({ text: option.text, coordinates: null });

    this.props.setLocationBoxFocused(false);
    Keyboard.dismiss();
  };

  render() {
    const { suggestions } = this.props;
    const results = suggestions.map(x => ({
      text: x.formattedAddress,
      option: x,
    }));
    return <Suggestions results={results} onPress={this.onOptionSelected} />;
  }
}

export default compose(
  connect(
    null,
    { setLocationBoxFocused, setLocation }
  ),
  connectLocation
)(SearchSuggest);
