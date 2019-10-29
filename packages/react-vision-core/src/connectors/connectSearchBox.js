import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';

// TODO

/**
 * connectSearchBox connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectSearchBox
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {boolean} isSearchStalled - a flag that indicates if Vision has detected that searches are stalled
 */
export default createConnector({
  displayName: 'CliniaSearchBox',
  propTypes: {
    defaultRefinement: PropTypes.string,
  },
});
