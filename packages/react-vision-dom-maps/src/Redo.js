import React from 'react';
import PropTypes from 'prop-types';
import { createClassNames, translatable } from '@clinia/react-vision-dom';
import GeoSearchContext from './GeoSearchContext';
import withGoogleMaps from './withGoogleMaps';

const cx = createClassNames('geosearch');
const RedoPropTypes = {
  googleMapsInstance: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

/**
 * @module Redo
 */

/**
 * @description Button that indicate triggers a search when clicked.
 * @alias module:Redo
 * @kind widget
 * @prop {function} translate - Should return the text to display in the button.
 * @themekey cvi-geosearch-control - The root div of the Control.
 * @themekey cvi-geosearch-redo - The re-search button.
 * @themekey cvi-geosearch-redo--disabled - The re-search button while disabled.
 * @example
 * ```js
 * <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
 *   {google => (
 *     <GeoSearch google={google}>
 *       {({ hits }) => (
 *         <Fragment>
 *           <Redo />
 *           {hits.map(hit => (
 *             <Marker
 *               key={hit.id}
 *               hit={hit}
 *             />
 *           ))}
 *         </Fragment>
 *       )}
 *     </GeoSearch>
 *   )}
 * </GoogleMapsLoader>
 * ```
 */
export const Redo = ({
  googleMapsInstance,
  translate,
  hasMapMoveSinceLastRefine,
  refineWithInstance,
}) => (
  <div className={cx('control')}>
    <button
      className={cx('redo', !hasMapMoveSinceLastRefine && 'redo--disabled')}
      disabled={!hasMapMoveSinceLastRefine}
      onClick={() => refineWithInstance(googleMapsInstance)}
    >
      {translate('redo')}
    </button>
  </div>
);

Redo.propTypes = {
  ...RedoPropTypes,
  hasMapMoveSinceLastRefine: PropTypes.bool.isRequired,
  refineWithInstance: PropTypes.func.isRequired,
};

const RedoWrapper = props => (
  <GeoSearchContext.Consumer>
    {({ hasMapMoveSinceLastRefine, refineWithInstance }) => (
      <Redo
        {...props}
        hasMapMoveSinceLastRefine={hasMapMoveSinceLastRefine}
        refineWithInstance={refineWithInstance}
      />
    )}
  </GeoSearchContext.Consumer>
);

RedoWrapper.propTypes = RedoPropTypes;

export default translatable({
  redo: 'Redo search here',
})(withGoogleMaps(RedoWrapper));
