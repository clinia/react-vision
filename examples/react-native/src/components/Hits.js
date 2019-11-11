import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { connectHits } from 'react-vision-native';

import { Container, Typography, Margin, Color } from '../styles';

const styles = StyleSheet.create({
  tag: {
    borderRadius: 5,
    backgroundColor: Color.primary,
    alignSelf: 'flex-start',
  },
  tagText: {
    ...Typography.subText,
    padding: Margin.smaller,
    color: 'white',
  },
  title: {
    ...Typography.title,
    marginTop: Margin.small,
  },
  text: {
    ...Typography.text,
    marginTop: Margin.small,
  },
  noContentFound: {
    ...Typography.text,
    marginTop: Margin.big,
    textAlign: 'center',
    width: '100%',
  },
});

class Hits extends React.Component {
  tag = type => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{type}</Text>
    </View>
  );

  hit = (record, isLast) => (
    <View
      style={[Container.hit, isLast ? { marginBottom: Margin.normal } : {}]}
    >
      {this.tag(record.type)}
      <Text style={styles.title}>{record.name}</Text>
      <Text style={styles.text}>
        {`${record.address.streetAddress} ${record.address.place}, ${record.address.regionCode}`}
      </Text>
    </View>
  );

  render() {
    const { records } = this.props;
    return (
      <View style={Container.hits}>
        <FlatList
          data={records}
          keyExtractor={record => record.id}
          renderItem={record =>
            this.hit(record.item, record.index === records.length - 1)
          }
          ListEmptyComponent={
            <Text style={styles.noContentFound}>No results found</Text>
          }
        />
      </View>
    );
  }
}

export default connectHits(Hits);
