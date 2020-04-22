import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  registerEvents,
  createListenersPropTypes,
  createFilterProps,
} from './utils';
import { GeoPointHitPropType } from './propTypes';
import withMapbox from './withMapbox';

const eventTypes = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
};

const excludes = ['children', 'draggable', 'element'].concat(
  Object.keys(eventTypes)
);
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
 * <MapboxLoader accessToken={accessToken} endpoints={endpoint}>
 *   {mapboxgl => (
 *     <GeoSearch mapboxgl={mapboxgl}>
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
 * </MapboxLoader>
 * ```
 */
export class Marker extends Component {
  static propTypes = {
    ...createListenersPropTypes(eventTypes),
    mapboxgl: PropTypes.object.isRequired,
    mapboxglInstance: PropTypes.object.isRequired,
    hit: GeoPointHitPropType.isRequired,
  };

  componentDidMount() {
    const { mapboxgl, mapboxglInstance, hit, ...props } = this.props;

    this.instance = new mapboxgl.Marker({ ...filterProps(props) })
      .setLngLat([hit._geoPoint.lon, hit._geoPoint.lat])
      .addTo(mapboxglInstance);

    registerEvents(eventTypes, this.props, this.instance._element);
  }

  componentWillUnmount() {
    this.instance.remove();
  }

  render() {
    return null;
  }
}

export default withMapbox(Marker);
