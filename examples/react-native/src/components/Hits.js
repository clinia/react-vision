/* eslint-disable no-console */
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { connectHits } from 'react-vision-native';

import { Container, Typography, Margin } from '../styles';

const styles = StyleSheet.create({
  tag: {
    borderRadius: 5,
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  tagText: {
    ...Typography.subText,
    padding: Margin.smaller,
    color: '#FFFFFF',
  },
  title: {
    ...Typography.title,
    marginTop: Margin.small,
  },
  text: {
    ...Typography.text,
    marginTop: Margin.small,
  },
});

class Hits extends React.Component {
  tag = type => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{type}</Text>
    </View>
  );

  hit = record => (
    <View style={Container.hit}>
      {this.tag(record.type)}
      <Text style={styles.title}>{record.name}</Text>
      <Text style={styles.text}>
        {`${record.address.streetAddress} ${record.address.place}, ${record.address.regionCode}`}
      </Text>
    </View>
  );

  render() {
    return (
      <View style={Container.hits}>
        <FlatList
          data={this.props.records}
          keyExtractor={record => record.id}
          renderItem={record => this.hit(record.item)}
        />
      </View>
    );
  }
}

export default connectHits(Hits);
