import React from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
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

const CURRENT_LOCATION = 'Current location';

class LocationBox extends React.Component {
  input;
  state = {
    location: undefined,
    enableLocation: true,
  };

  componentDidMount() {
    Permissions.getAsync(Permissions.LOCATION).then(response => {
      this.setState({
        enableLocation: !(
          response.permissions &&
          response.permissions.location &&
          response.permissions.location.status === 'denied'
        ),
      });
    });
  }

  onFocus = () => {
    if (this.state.location === CURRENT_LOCATION) {
      this.setState({ location: null });
    }
    this.toggleSearch(true);
  };

  onTextChange = text => {
    this.setState({ location: text });
    // const { searchForSuggestions } = this.props;
    // searchForSuggestions(text);
    // this.props.setQuery(text);
  };

  onPress = () => {
    // const { location } = this.props;

    // this.props.refine(query);
    this.input.blur();

    this.toggleSearch(false);
  };

  onCurrentLocationPress = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      console.log(await Location.getCurrentPositionAsync());
      this.setState({ location: CURRENT_LOCATION });
    } else {
      this.setState({ enableLocation: false });
    }

    this.input.blur();
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
          onFocus={this.onFocus}
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
