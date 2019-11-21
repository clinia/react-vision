import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Instantiate an instance of the Google maps client on the client side.
 * Since this component rely on the `document` property, this won't be run on the server during any SSR phase.
 * @module GoogleMapsLoader
 * @kind widget
 * @prop {string} apiKey - Your Google maps api key.
 * @prop {string} endpoint=https://maps.googleapis.com/maps/api/js?v=quarterly - The default endpoint to get the maps from.
 * @example
 * ```js
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch
 *       google={google}
 *       defaultRefinement={{
 *         northEast: { lat: 45.7058381, lng: -73.47426 },
 *         southWest: { lat: 45.410246, lng: -73.986345 },
 *       }}
 *     >
 *       {({ records }) => (
 *         <Fragment>
 *           {records.map(record => (
 *             <Marker key={record.id} record={record} />
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </GoogleMapsLoader>
 * ```
 */
class GoogleMapsLoader extends Component {
  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    endpoint: PropTypes.string,
  };

  static defaultProps = {
    endpoint: 'https://maps.googleapis.com/maps/api/js?v=quarterly',
  };

  state = {
    google: null,
  };

  isUnmounting = false;

  componentDidMount() {
    // Inline the import to avoid to run the module on the server (rely on `document`)
    return import('scriptjs').then(({ default: injectScript }) => {
      const { apiKey, endpoint } = this.props;
      const operator = endpoint.indexOf('?') !== -1 ? '&' : '?';
      const endpointWithCredentials = `${endpoint}${operator}key=${apiKey}`;

      injectScript(endpointWithCredentials, () => {
        if (!this.isUnmounting) {
          this.setState(() => ({
            google: window.google,
          }));
        }
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounting = true;
  }

  render() {
    if (!this.state.google) {
      return null;
    }

    return this.props.children(this.state.google);
  }
}

export default GoogleMapsLoader;
