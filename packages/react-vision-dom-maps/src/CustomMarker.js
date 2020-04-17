import { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import createHTMLMarker from './elements/createHTMLMarker';
import { registerEvents, createListenersPropTypes } from './utils';
import { GeolocHitPropType } from './propTypes';
import withGoogleMaps from './withGoogleMaps';

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
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch google={google}>
 *       {({ hits }) => (
 *         <Fragment>
 *           {hits.map(hit => (
 *              <CustomMarker
 *                key={hit.id}
 *                hit={hit}
 *                anchor={{ x: 5, y: 0 }}
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
    hit: GeolocHitPropType.isRequired,
    children: PropTypes.node.isRequired,
    google: PropTypes.object.isRequired,
    googleMapsInstance: PropTypes.object.isRequired,
    className: PropTypes.string,
    anchor: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
  };

  static defaultProps = {
    className: '',
    anchor: {
      x: 0,
      y: 0,
    },
  };

  static isReact16() {
    return typeof ReactDOM.createPortal === 'function';
  }

  state = {
    marker: null,
  };

  componentDidMount() {
    const { hit, google, googleMapsInstance, className, anchor } = this.props;
    // Not the best way to create the reference of the CustomMarker
    // but since the Google object is required didn't find another
    // solution. Ideas?
    const Marker = createHTMLMarker(google);

    const marker = new Marker({
      map: googleMapsInstance,
      position: hit.geoPoint,
      className,
      anchor,
    });

    this.removeListeners = registerEvents(eventTypes, this.props, marker);

    this.setState(() => ({
      marker,
    }));
  }

  componentDidUpdate() {
    const { children } = this.props;
    const { marker } = this.state;

    this.removeListeners();

    this.removeListeners = registerEvents(eventTypes, this.props, marker);

    if (!CustomMarker.isReact16()) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        marker.element
      );
    }
  }

  componentWillUnmount() {
    const { marker } = this.state;

    if (!CustomMarker.isReact16()) {
      ReactDOM.unmountComponentAtNode(marker.element);
    }

    marker.setMap(null);
  }

  render() {
    const { children } = this.props;
    const { marker } = this.state;

    if (!marker || !CustomMarker.isReact16()) {
      return null;
    }

    return ReactDOM.createPortal(children, marker.element);
  }
}

export default withGoogleMaps(CustomMarker);
