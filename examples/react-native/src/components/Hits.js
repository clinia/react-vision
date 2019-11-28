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
    const { records, hit } = this.props;

    return (
      <FlatList
        data={records}
        keyExtractor={record => record.id}
        renderItem={record =>
          hit(record.item, record.index === records.length - 1)
        }
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
