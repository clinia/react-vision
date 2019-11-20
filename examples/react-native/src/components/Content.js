import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { Container } from '../styles';
import LocationSuggest from './LocationSuggest';
import SearchSuggest from './SearchSuggest';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

const mapStateToProps = state => ({
  searchBoxFocused: state.store.searchBoxFocused,
  locationBoxFocused: state.store.locationBoxFocused,
});

class Content extends React.Component {
  render() {
    const { children, searchBoxFocused, locationBoxFocused } = this.props;
    const isAutocompleting = searchBoxFocused || locationBoxFocused;
    return (
      <View style={Container.main}>
        {/* Use the `display: 'none'` approach to prevent re-rendering the map everytime we show the suggestions */}
        <View
          style={[Container.content, isAutocompleting ? styles.hidden : {}]}
        >
          {children}
        </View>
        <View
          style={[Container.content, searchBoxFocused ? {} : styles.hidden]}
        >
          <SearchSuggest />
        </View>
        <View
          style={[Container.content, locationBoxFocused ? {} : styles.hidden]}
        >
          <LocationSuggest />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(Content);
