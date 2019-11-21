import PropTypes from 'prop-types';

/**
 * @module GeoSearch/ProType
 */

/**
 * @typedef {Object} LatLngPropType
 * @prop {number} lat - Latitude.
 * @prop {number} lng - Longitude.
 */
export const LatLngPropType = PropTypes.shape({
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
});

/**
 * @typedef {Object} BoundingBoxPropType
 * @prop {LatLngPropType} northEast - NorthEast coordinate descibing the bounds.
 * @prop {LatLngPropType} southWest - SouthWest coordinate descibing the bounds.
 */
export const BoundingBoxPropType = PropTypes.shape({
  northEast: LatLngPropType.isRequired,
  southWest: LatLngPropType.isRequired,
});

/**
 * @typedef {Object} GeolocHitPropType
 * @prop {LatLngPropType} geoPoint - Coordinate of the hit.
 */
export const GeolocHitPropType = PropTypes.shape({
  geoPoint: LatLngPropType.isRequired,
});
