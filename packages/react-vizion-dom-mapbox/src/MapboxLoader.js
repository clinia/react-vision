import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @module MapboxLoader
 */

/**
 * @description Instantiate an instance of the Mapboxgl client on the client side.
 * Since this component rely on the `document` property, this won't be run on the server during any [Server Side Rendering](guide/Server-side_rendering.html) phase.
 * @alias module:MapboxLoader
 * @kind widget
 * @prop {string} accessToken - Your Mapbox access token.
 * @prop {string} endpoints=[https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js,https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.css] - The default endpoint to get the maps from.
 * @example
 * ```js
 * <MapboxLoader accessToken={apiKey} endpoint={endpoint}>
 *   {mapboxgl => (
 *     <GeoSearch
 *       mapboxgl={mapboxgl}
 *       defaultRefinement={{
 *         northEast: { lat: 45.7058381, lng: -73.47426 },
 *         southWest: { lat: 45.410246, lng: -73.986345 },
 *       }}
 *     >
 *       {({ hits }) => (
 *         <Fragment>
 *           {hits.map(hit => (
 *             <Marker key={hit.id} hit={hit} />
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </MapboxLoader>
 * ```
 */
class MapboxLoader extends Component {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    endpoints: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    endpoints: ['https://api.mapbox.com/mapbox-gl-js/v1.9.1/mapbox-gl.js'],
  };

  state = {
    mapboxgl: null,
  };

  isUnmounting = false;

  componentDidMount() {
    // Inline the import to avoid to run the module on the server (rely on `document`)
    return import('scriptjs').then(({ default: injectScript }) => {
      const { accessToken, endpoints } = this.props;

      // Try to load css first

      injectScript(endpoints, () => {
        if (!this.isUnmounting) {
          window.mapboxgl.accessToken = accessToken;
          this.setState(() => ({
            mapboxgl: window.mapboxgl,
          }));
        }
      });
    });
  }

  componentWillUnmount() {
    this.isUnmounting = true;
  }

  render() {
    if (!this.state.mapboxgl) {
      return null;
    }

    return this.props.children(this.state.mapboxgl);
  }
}

export default MapboxLoader;
