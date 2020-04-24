import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  getIndexId,
  cleanUpValue,
  refineValue,
  getCurrentRefinementValue,
  getResults,
} from '../core/indexUtils';

const namespace = 'menu';

function getId(props) {
  return props.property;
}

function getCurrentRefinement(props, searchState, context) {
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    `${namespace}.${getId(props)}`,
    null
  );

  if (currentRefinement === '') {
    return null;
  }
  return currentRefinement;
}

function getValue(name, props, searchState, context) {
  const currentRefinement = getCurrentRefinement(props, searchState, context);
  return name === currentRefinement ? '' : name;
}

function getLimit({ showMore, limit, showMoreLimit }) {
  return showMore ? showMoreLimit : limit;
}

function refine(props, searchState, nextRefinement, context) {
  const id = getId(props);
  const nextValue = { [id]: nextRefinement ? nextRefinement : '' };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage, namespace);
}

function cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, `${namespace}.${getId(props)}`);
}

const defaultSortBy = ['count:desc', 'name:asc'];

/**
 * connectMenu connector provides the logic to build a widget that will
 * give the user the ability to choose a single value for a specific facet.
 * @name connectMenu
 * @requirements The property passed to the `property` prop must be facetable and filterable
 * @kind connector
 * @propType {string} property - the name of the property in the record
 * @propType {boolean} [showMore=false] - true if the component should display a button that will expand the number of items
 * @propType {number} [limit=10] - the minimum number of diplayed items
 * @propType {number} [showMoreLimit=20] - the maximun number of displayed items. Only used when showMore is set to `true`
 * @propType {string} [defaultRefinement] - the value of the item selected by default
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{count: number, isRefined: boolean, label: string, value: string}>} items - the list of items the Menu can display.
 */
export default createConnector({
  displayName: 'CliniaMenu',

  propTypes: {
    property: PropTypes.string.isRequired,
    showMore: PropTypes.bool,
    limit: PropTypes.number,
    showMoreLimit: PropTypes.number,
    defaultRefinement: PropTypes.string,
    transformItems: PropTypes.func,
  },

  defaultProps: {
    showMore: false,
    limit: 10,
    showMoreLimit: 20,
  },

  getProvidedProps(props, searchState, searchResults) {
    const { property, searchable } = props;
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    const canRefine =
      Boolean(results) && Boolean(results.getFacetByName(property));

    if (!canRefine) {
      return {
        items: [],
        currentRefinement: getCurrentRefinement(props, searchState, {
          cvi: props.contextValue,
          multiIndexContext: props.indexContextValue,
        }),
        canRefine,
      };
    }

    const items = results
      .getFacetValues(property, {
        sortBy: searchable ? undefined : defaultSortBy,
      })
      .map(v => ({
        label: v.name,
        value: getValue(v.name, props, searchState, {
          cvi: props.contextValue,
          multiIndexContext: props.indexContextValue,
        }),
        count: v.count,
        isRefined: v.isRefined,
      }));

    const transformedItems = props.transformItems
      ? props.transformItems(items)
      : items;

    return {
      items: transformedItems.slice(0, getLimit(props)),
      currentRefinement: getCurrentRefinement(props, searchState, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      }),
      canRefine: transformedItems.length > 0,
    };
  },

  refine(props, searchState, nextRefinement) {
    return refine(props, searchState, nextRefinement, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  cleanUp(props, searchState) {
    return cleanUp(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
  },

  getSearchParameters(searchParameters, props, searchState) {
    const { property } = props;

    searchParameters = searchParameters.setQueryParameters({
      maxValuesPerFacet: Math.max(
        searchParameters.maxValuesPerFacet || 0,
        getLimit(props)
      ),
    });

    searchParameters = searchParameters.addDisjunctiveFacet(property);

    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
    if (currentRefinement !== null) {
      searchParameters = searchParameters.addDisjunctiveFacetRefinement(
        property,
        currentRefinement
      );
    }

    return searchParameters;
  },

  getMetadata(props, searchState) {
    const id = getId(props);
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
    return {
      id,
      index: getIndexId({
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      }),
      items:
        currentRefinement === null
          ? []
          : [
              {
                label: `${props.property}: ${currentRefinement}`,
                property: props.property,
                value: nextState =>
                  refine(props, nextState, '', {
                    cvi: props.contextValue,
                    multiIndexContext: props.indexContextValue,
                  }),
                currentRefinement,
              },
            ],
    };
  },
});
