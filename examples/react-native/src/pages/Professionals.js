import React from 'react';
import { Index } from 'react-vision-native';
import { Text, View, StyleSheet } from 'react-native';

import Content from '../components/Content';
import Hits from '../components/Hits';
import Header from '../components/Header';
import { Container, Typography, Margin, Color } from '../styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  text: {
    ...Typography.text,
    marginTop: Margin.small,
  },
});

class Professionals extends React.Component {
  static navigationOptions = {
    headerTitle: <Header />,
    headerStyle: {
      height: 80,
    },
  };

  hit = (hit, isLast) => (
    <View
      style={[Container.hit, isLast ? { marginBottom: Margin.normal } : {}]}
    >
      <Text style={Typography.title}>{`${hit.title ? `${hit.title} ` : ''}${
        hit.name
      }`}</Text>
    </View>
  );

  render() {
    return (
      <Content>
        <Index indexName="professional">
          <Hits hit={this.hit} />
        </Index>
      </Content>
    );
  }
}

export default Professionals;
