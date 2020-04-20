import PropTypes from 'prop-types';

/**
 * @typedef {Object} LatLngPropType
 * @prop {number} lat - Latitude (-90 to 90).
 * @prop {number} lng - Longitude (-180 tp 180).
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
 * @prop {LatLngPropType} _geoPoint - Coordinate of the hit.
 */
export const GeoPointHitPropType = PropTypes.shape({
  _geoPoint: LatLngPropType.isRequired,
});
