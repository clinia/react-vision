/* eslint-disable no-console */
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { connectHits } from 'react-vision-native';

class HitsComponent extends React.Component {
  state = {
    query: null,
  };

  componentDidMount() {
    console.log(this.props);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  render() {
    return (
      <View
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        <FlatList
          data={this.props.records}
          renderItem={record => <Text>{record.id}</Text>}
        />
      </View>
    );
  }
}

export default connectHits(HitsComponent);
