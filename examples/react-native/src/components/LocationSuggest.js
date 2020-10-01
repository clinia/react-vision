import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import { connectGeocoder } from '@clinia/react-vizion-core';

import Suggestions from './Suggestions';
import { setLocationBoxFocused, setLocation } from '../redux/actions';

class SearchSuggest extends React.Component {
  onOptionSelected = option => {
    const { refine } = this.props;

    refine(option.option.geometry.location);
    this.props.setLocation({ text: option.text, coordinates: null });

    this.props.setLocationBoxFocused(false);
    Keyboard.dismiss();
  };

  render() {
    const { hits } = this.props;
    const results = hits.map(x => ({
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
  connectGeocoder
)(SearchSuggest);
