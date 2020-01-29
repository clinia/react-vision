import React from 'react';
import PropTypes from 'prop-types';
import { createClassNames, translatable } from 'react-vision-dom';
import GeoSearchContext from './GeoSearchContext';
import withGoogleMaps from './withGoogleMaps';

const cx = createClassNames('GeoSearch');
const ControlPropTypes = {
  googleMapsInstance: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

/**
 * @module Control
 */

/**
 * @description Control to enable, disable or to manually trigger a search on map movement.
 * @alias module:Control
 * @kind widget
 * @themekey cvi-geosearch-control - The root div of the Control.
 * @themekey cvi-geosearch-label - The label of the checkbox.
 * @themekey cvi-geosearch-input - The checkbox.
 * @themekey cvi-geosearch-redo - The re-search button.
 * @example
 * ```js
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch google={google}>
 *       {({ records }) => (
 *         <Fragment>
 *           <Control />
 *           {records.map(record => (
 *             <Marker
 *               key={record.id}
 *               record={record}
 *             />
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </GoogleMapsLoader>
 * ```
 */
export const Control = ({
  googleMapsInstance,
  translate,
  isRefineOnMapMove,
  hasMapMoveSinceLastRefine,
  toggleRefineOnMapMove,
  refineWithInstance,
}) => (
  <div className={cx('control')}>
    {isRefineOnMapMove || !hasMapMoveSinceLastRefine ? (
      <label className={cx('label')}>
        <input
          className={cx('input')}
          type="checkbox"
          checked={isRefineOnMapMove}
          onChange={toggleRefineOnMapMove}
        />
        {translate('control')}
      </label>
    ) : (
      <button
        className={cx('redo')}
        onClick={() => refineWithInstance(googleMapsInstance)}
      >
        {translate('redo')}
      </button>
    )}
  </div>
);

Control.propTypes = {
  ...ControlPropTypes,
  isRefineOnMapMove: PropTypes.bool.isRequired,
  toggleRefineOnMapMove: PropTypes.func.isRequired,
  hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
  refineWithInstance: PropTypes.func.isRequired,
};

const ControlWrapper = props => (
  <GeoSearchContext.Consumer>
    {({
      isRefineOnMapMove,
      hasMapMoveSinceLastRefine,
      toggleRefineOnMapMove,
      refineWithInstance,
    }) => (
      <Control
        {...props}
        isRefineOnMapMove={isRefineOnMapMove}
        hasMapMoveSinceLastRefine={hasMapMoveSinceLastRefine}
        toggleRefineOnMapMove={toggleRefineOnMapMove}
        refineWithInstance={refineWithInstance}
      />
    )}
  </GeoSearchContext.Consumer>
);

ControlWrapper.propTypes = ControlPropTypes;

export default translatable({
  control: 'Search as I move the map',
  redo: 'Redo search here',
})(withGoogleMaps(ControlWrapper));
