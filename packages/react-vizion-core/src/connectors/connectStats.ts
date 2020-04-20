import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';

/**
 * connectStats connector provides the logic to build a widget that will
 *  displays clinia search statistics (hits number and processing time).
 * @name connectStats
 * @kind connector
 * @providedPropType {number} total - number of hits returned by Clinia.
 * @providedPropType {number} took - the time in ms took by Clinia to search for results.
 */
export default createConnector({
  displayName: 'CliniaStats',

  getProvidedProps(props, _searchState, searchResults) {
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!results) {
      return null;
    }
    return {
      total: results.total,
      took: results.took,
    };
  },
});
