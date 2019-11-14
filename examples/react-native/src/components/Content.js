import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

import { Container } from '../styles';
import AutoSuggest from './AutoSuggest';

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});

const mapStateToProps = state => ({
  isSearching: state.store.isSearching,
});

class Content extends React.Component {
  render() {
    const { children, isSearching } = this.props;
    return (
      <View style={Container.main}>
        {/* Use the `display: 'none'` approach to prevent re-rendering the map everytime we show the suggestions */}
        <View style={[Container.content, isSearching ? {} : styles.hidden]}>
          <AutoSuggest />
        </View>
        <View style={[Container.content, isSearching ? styles.hidden : {}]}>
          {children}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(Content);
