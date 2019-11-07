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
  state = {
    records: [
      {
        documentType: 'health_facility',
        type: 'CLINIC',
        address: {
          streetAddress: '1533 Sporer Terrace',
          suiteNumber: null,
          postalCode: 'W6B3R0',
          neighborhood: null,
          locality: null,
          place: 'Port Irving',
          region: 'Quebec',
          regionCode: 'QC',
          country: 'Canada',
          countryCode: 'CA',
        },
        geoPoint: {
          lat: 81.4272,
          lng: -171.0446,
        },
        onlineBookingUrl: null,
        distance: null,
        openingHours: null,
        id: '4981c3f3-49d0-426d-a363-42752ca15eab',
        name: 'Boyle and Sons',
        note: null,
        phones: [
          {
            countryCode: '+1',
            number: '9061145232',
            extension: null,
            type: 'HOME',
          },
        ],
        owner: 'CLINIA',
      },
    ],
  };

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
          data={this.state.records}
          keyExtractor={record => record.id}
          renderItem={record => this.hit(record.item)}
        />
      </View>
    );
  }
}

export default connectHits(Hits);
