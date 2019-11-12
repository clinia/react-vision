import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { Container } from '../styles';
import SuggestionMode from '../redux/suggestionMode';
import AutoSuggest from './AutoSuggest';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

const mapStateToProps = state => ({
  suggestionMode: state.store.suggestionMode,
});

class Content extends React.Component {
  render() {
    const { children, suggestionMode } = this.props;
    return (
      <View style={Container.main}>
        {/* Use the `display: 'none'` approach to prevent re-rendering the map everytime we show the suggestions */}
        <View
          style={[
            Container.content,
            suggestionMode !== SuggestionMode.None ? {} : styles.hidden,
          ]}
        >
          <AutoSuggest />
        </View>
        <View
          style={[
            Container.content,
            suggestionMode === SuggestionMode.None ? {} : styles.hidden,
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(Content);
