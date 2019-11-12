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

import { Input, Color, Margin } from '../styles';
import { setSuggestionMode, setLocation } from '../redux/actions';
import SuggestionMode from '../redux/suggestionMode';

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

const mapStateToProps = state => ({
  location: state.store.location,
});

class LocationBox extends React.Component {
  input;
  state = {
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
    const { location } = this.props;
    if (location === CURRENT_LOCATION) {
      this.props.setLocation(null);
    }
    this.toggleSearch(SuggestionMode.Location);
  };

  onTextChange = text => {
    // const { searchForSuggestions } = this.props;
    // searchForSuggestions(text);
    this.props.setLocation(text);
  };

  onPress = () => {
    // const { location } = this.props;

    // this.props.refine(query);

    this.input.blur();
    this.toggleSearch(SuggestionMode.None);
  };

  onCurrentLocationPress = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      console.log(await Location.getCurrentPositionAsync());
      this.props.setLocation(CURRENT_LOCATION);
    } else {
      this.setState({ enableLocation: false });
    }

    this.input.blur();
    this.toggleSearch(SuggestionMode.None);
  };

  toggleSearch = mode => this.props.setSuggestionMode(mode);

  render() {
    const { enableLocation } = this.state;
    const { location } = this.props;
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
  mapStateToProps,
  { setSuggestionMode, setLocation }
)(LocationBox);
