import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { registerEvents, createListenersPropTypes } from './utils';
import { GeoPointHitPropType } from './propTypes';
import withMapbox from './withMapbox';

const eventTypes = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onMouseDown: 'mousedown',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseMove: 'mousemove',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
};

/**
 * @module CustomMarker
 */

/**
 * @description Allow the creation a custom map marker.
 * @alias module:CustomMarker
 * @kind widget
 * @prop {{ x: number, y: number }} anchor - The anchor of the marker.
 * @prop {string} className - Classname for the custom marker.
 * @prop {string} label - Label to display.
 * @prop {function} on* - Listen to any mouse events sent from the marker.
 * @prop {GeolocHitPropType} hit - Record to display.
 * @example
 * ```js
 * <MapboxLoader accessToken={accessToken} endpoints={endpoint}>
 *   {mapboxgl => (
 *     <GeoSearch mapboxgl={mapboxgl}>
 *       {({ hits }) => (
 *         <Fragment>
 *           {hits.map(hit => (
 *              <CustomMarker
 *                key={hit.id}
 *                hit={hit}
 *                onMouseEnter={() => {}}
 *                onMouseLeave={() => {}}
 *              >
 *                <div className={classNames.join(' ').trim()}>
 *                  <span>{hit.name}</span>
 *                </div>
 *              </CustomMarker>
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </GoogleMapsLoader>
 * ```
 */
export class CustomMarker extends Component {
  static propTypes = {
    ...createListenersPropTypes(eventTypes),
    hit: GeoPointHitPropType.isRequired,
    children: PropTypes.node.isRequired,
    mapboxgl: PropTypes.object.isRequired,
    mapboxglInstance: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  static isReact16() {
    return typeof ReactDOM.createPortal === 'function';
  }

  state = {
    marker: null,
  };

  componentDidMount() {
    const { hit, mapboxgl, mapboxglInstance, className } = this.props;

    const element = document.createElement('div');
    element.className = className;

    const marker = new mapboxgl.Marker({ element })
      .setLngLat([hit._geoPoint.lon, hit._geoPoint.lat])
      .addTo(mapboxglInstance);

    this.element = element;
    registerEvents(eventTypes, this.props, element);

    this.setState(() => ({
      marker,
    }));
  }

  componentDidUpdate() {
    const { children } = this.props;

    if (!CustomMarker.isReact16()) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        this.element
      );
    }
  }

  componentWillUnmount() {
    const { marker } = this.state;

    if (!CustomMarker.isReact16()) {
      ReactDOM.unmountComponentAtNode(this.element);
    }

    marker.remove();
  }

  render() {
    const { children } = this.props;
    const { marker } = this.state;

    if (!marker || !CustomMarker.isReact16()) {
      return null;
    }

    return ReactDOM.createPortal(children, this.element);
  }
}

export default withMapbox(CustomMarker);
