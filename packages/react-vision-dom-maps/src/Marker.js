import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  registerEvents,
  createListenersPropTypes,
  createFilterProps,
} from './utils';
import { GeolocHitPropType } from './propTypes';
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
 * @prop {GeolocHitPropType} record - Record to display.
 * @prop {string} label - Label to display.
 * @prop {function} on* - Listen to any mouse events sent from the marker.
 * @example
 * ```js
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch google={google}>
 *       {({ records }) => (
 *         <Fragment>
 *           {records.map(record => (
 *             <Marker
 *               key={record.id}
 *               record={record}
 *               label={record.name}
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
    record: GeolocHitPropType.isRequired,
  };

  componentDidMount() {
    const { google, googleMapsInstance, record, ...props } = this.props;

    this.instance = new google.maps.Marker({
      ...filterProps(props),
      map: googleMapsInstance,
      position: record.geoPoint,
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
