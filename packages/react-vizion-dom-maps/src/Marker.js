import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  registerEvents,
  createListenersPropTypes,
  createFilterProps,
} from './utils';
import { GeoPointHitPropType } from './propTypes';
import withGoogleMaps from './withGoogleMaps';

const eventTypes = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
};

const excludes = ['children'].concat(Object.keys(eventTypes));
const filterProps = createFilterProps(excludes);

/**
 * @module Marker
 */

/**
 * @description Map marker.
 * @alias module:Marker
 * @kind widget
 * @prop {GeolocHitPropType} hit - Record to display.
 * @prop {string} label - Label to display.
 * @prop {function} on* - Listen to any mouse events sent from the marker.
 * @example
 * ```js
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch google={google}>
 *       {({ hits }) => (
 *         <Fragment>
 *           {hits.map(hit => (
 *             <Marker
 *               key={hit.id}
 *               hit={hit}
 *               label={hit.name}
 *               onClick={() => {}}
 *               onDoubleClick={() => {}}
 *             />
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </GoogleMapsLoader>
 * ```
 */
export class Marker extends Component {
  static propTypes = {
    ...createListenersPropTypes(eventTypes),
    google: PropTypes.object.isRequired,
    googleMapsInstance: PropTypes.object.isRequired,
    hit: GeoPointHitPropType.isRequired,
  };

  componentDidMount() {
    const { google, googleMapsInstance, hit, ...props } = this.props;

    this.instance = new google.maps.Marker({
      ...filterProps(props),
      map: googleMapsInstance,
      position: hit._geoPoint,
    });

    this.removeEventsListeners = registerEvents(
      eventTypes,
      this.props,
      this.instance
    );
  }

  componentDidUpdate() {
    this.removeEventsListeners();

    this.removeEventsListeners = registerEvents(
      eventTypes,
      this.props,
      this.instance
    );
  }

  componentWillUnmount() {
    this.instance.setMap(null);
  }

  render() {
    return null;
  }
}

export default withGoogleMaps(Marker);
