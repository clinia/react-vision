import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

function getId() {
  return 'sortBy';
}

function getCurrentRefinement(props, searchState, context) {
  const id = getId(props);
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    id,
    null
  );

  if (currentRefinement) {
    return currentRefinement;
  }
  return null;
}

/**
 * The connectSortBy connector provides the logic to build a widget that will
 *  display a list of indices. This allows a user to change how the hits are being sorted.
 * @name connectSortBy
 * @kind connector
 * @propType {string} defaultRefinement - The default selected index.
 * @propType {{value: string, label: string}[]} items - The list of indexes to search in.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string[]} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{isRefined: boolean, label?: string, value: string}>} items - the list of items the HitsPerPage can display.  If no label provided, the value will be displayed.
 */
export default createConnector({
  displayName: 'CliniaSortBy',

  propTypes: {
    defaultRefinement: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    transformItems: PropTypes.func,
  },

  getProvidedProps(props, searchState) {
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
    const items = props.items.map(item =>
      item.value === currentRefinement
        ? { ...item, isRefined: true }
        : { ...item, isRefined: false }
    );
    return {
      items: props.transformItems ? props.transformItems(items) : items,
      currentRefinement,
    };
  },

  refine(props, searchState, nextRefinement) {
    const id = getId();
    const nextValue = { [id]: nextRefinement };
    const resetPage = true;
    return refineValue(
      searchState,
      nextValue,
      { cvi: props.contextValue, multiIndexContext: props.indexContextValue },
      resetPage
    );
  },

  cleanUp(props, searchState) {
    return cleanUpValue(
      searchState,
      { cvi: props.contextValue, multiIndexContext: props.indexContextValue },
      getId()
    );
  },

  getSearchParameters(searchParameters, props, searchState) {
    const sort = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    return searchParameters.setQueryParameter('sort', sort);
  },

  getMetadata() {
    return { id: getId() };
  },
});
