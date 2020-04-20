import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Index } from 'react-vizion-native';

import Content from '../components/Content';
import Hits from '../components/Hits';
import Header from '../components/Header';
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
});

class HealthFacilities extends React.Component {
  static navigationOptions = {
    headerTitle: <Header />,
    headerStyle: {
      height: 80,
    },
  };

  tag = type => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{type}</Text>
    </View>
  );

  hit = (hit, isLast) => (
    <View
      style={[Container.hit, isLast ? { marginBottom: Margin.normal } : {}]}
    >
      {this.tag(hit.type)}
      <Text style={styles.title}>{hit.name}</Text>
      <Text style={styles.text}>
        {`${hit.address.streetAddress} ${hit.address.place}, ${hit.address.regionCode}`}
      </Text>
    </View>
  );

  render() {
    return (
      <Content>
        <Index indexName="health_facility">
          <Hits hit={this.hit} />
        </Index>
      </Content>
    );
  }
}

export default HealthFacilities;
