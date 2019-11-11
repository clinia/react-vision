import React from 'react';
import { connect } from 'react-redux';
import { TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { setIsSearching } from '../redux/actions';
import { Input, Color, Margin } from '../styles';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: Margin.small,
    marginLeft: Margin.normal,
    marginRight: Margin.normal,
    marginBottom: Margin.small,
  },
  input: {
    ...Input.input,
    marginRight: Margin.smaller,
    flexGrow: 1,
  },
  icon: {
    width: 32,
    height: 32,
  },
});

class LocationBox extends React.Component {
  input;
  state = {
    location: undefined,
    enableLocation: true,
  };

  componentDidMount() {
    Permissions.getAsync(Permissions.LOCATION).then(response => {
      console.log(response);
      this.setState({
        enableLocation: !(
          response.permissions &&
          response.permissions.location &&
          response.permissions.location.status === 'denied'
        ),
      });
    });
  }

  onTextChange = text => {
    // const { searchForSuggestions } = this.props;
    // searchForSuggestions(text);
    // this.props.setQuery(text);
  };

  onPress = () => {
    // const { query } = this.props;

    // this.props.refine(query);
    this.input.blur();

    this.toggleSearch(false);
  };

  onCurrentLocationPress = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      console.log(await Location.getCurrentPositionAsync());
      this.setState({ location: 'Current location' });
    } else {
      this.setState({ enableLocation: false });
    }
  };

  toggleSearch = isSearching => this.props.setIsSearching(isSearching);

  render() {
    const { location, enableLocation } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          value={location}
          style={styles.input}
          placeholder="Location"
          placeholderColor={Color.placeholder}
          autoCorrect={false}
          returnKeyType="search"
          onChangeText={this.onTextChange}
          onFocus={() => this.toggleSearch(true)}
          onBlur={() => this.toggleSearch(false)}
          onSubmitEditing={this.onPress}
          ref={ref => {
            this.input = ref;
          }}
        />
        <TouchableOpacity
          disabled={!enableLocation}
          style={styles.icon}
          onPress={this.onCurrentLocationPress}
        >
          <Image
            style={[
              styles.icon,
              enableLocation
                ? { tintColor: Color.primary }
                : { tintColor: Color.disabled, opacity: 0.5 },
            ]}
            source={require('../../assets/current_location.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(
  null,
  { setIsSearching }
)(LocationBox);
