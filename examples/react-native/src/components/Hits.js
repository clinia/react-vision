import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import { connectInfiniteHits } from 'react-vision-native';

import { Typography, Margin } from '../styles';

const styles = StyleSheet.create({
  noContentFound: {
    ...Typography.text,
    marginTop: Margin.big,
    textAlign: 'center',
    width: '100%',
  },
});

class Hits extends React.Component {
  onEndReached = () => {
    const { hasMore, refineNext } = this.props;
    if (hasMore) {
      refineNext();
    }
  };

  render() {
    const { hits, hit } = this.props;

    return (
      <FlatList
        data={hits}
        keyExtractor={record => record.id}
        renderItem={record => hit(record.item, hits.index === hits.length - 1)}
        onEndReachedThreshold={0.05}
        onEndReached={this.onEndReached}
        ListEmptyComponent={
          <Text style={styles.noContentFound}>No results found</Text>
        }
      />
    );
  }
}

export default connectInfiniteHits(Hits);
