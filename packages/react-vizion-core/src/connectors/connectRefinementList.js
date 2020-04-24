import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  getIndexId,
  refineValue,
  getCurrentRefinementValue,
  getResults,
} from '../core/indexUtils';

const namespace = 'refinementList';

function getId(props) {
  return props.property;
}

function getCurrentRefinement(props, searchState, context) {
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    `${namespace}.${getId(props)}`,
    []
  );

  if (typeof currentRefinement !== 'string') {
    return currentRefinement;
  }

  if (currentRefinement) {
    return [currentRefinement];
  }

  return [];
}

function getValue(name, props, searchState, context) {
  const currentRefinement = getCurrentRefinement(props, searchState, context);
  const isAnewValue = currentRefinement.indexOf(name) === -1;
  const nextRefinement = isAnewValue
    ? currentRefinement.concat([name]) // cannot use .push(), it mutates
    : currentRefinement.filter(selectedValue => selectedValue !== name); // cannot use .splice(), it mutates
  return nextRefinement;
}

function getLimit({ showMore, limit, showMoreLimit }) {
  return showMore ? showMoreLimit : limit;
}

function refine(props, searchState, nextRefinement, context) {
  const id = getId(props);
  // Setting the value to an empty string ensures that it is persisted in
  // the URL as an empty value.
  // This is necessary in the case where `defaultRefinement` contains one
  // item and we try to deselect it. `nextSelected` would be an empty array,
  // which would not be persisted to the URL.
  // {foo: ['bar']} => "foo[0]=bar"
  // {foo: []} => ""
  const nextValue = { [id]: nextRefinement.length > 0 ? nextRefinement : '' };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage, namespace);
}

function cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, `${namespace}.${getId(props)}`);
}
/**
 * connectRefinementList connector provides the logic to build a widget that will
 * give the user the ability to choose multiple values for a specific facet.
 * @name connectRefinementList
 * @kind connector
 * @requirements The property passed to the `property` prop must be present facetable"
 * @propType {string} property - the name of the property in the record
 * @propType {string} [operator=or] - How to apply the refinements. Possible values: 'or' or 'and'.
 * @propType {boolean} [showMore=false] - true if the component should display a button that will expand the number of items
 * @propType {number} [limit=10] - the minimum number of displayed items
 * @propType {number} [showMoreLimit=20] - the maximun number of displayed items. Only used when showMore is set to `true`
 * @propType {string[]} defaultRefinement - the values of the items selected by default. The searchState of this widget takes the form of a list of `string`s, which correspond to the values of all selected refinements. However, when there are no refinements selected, the value of the searchState is an empty string.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string[]} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{count: number, isRefined: boolean, label: string, value: string}>} items - the list of items the RefinementList can display.
 * @providedPropType {boolean} canRefine - a boolean that says whether you can refine
 */

const sortBy = ['isRefined', 'count:desc', 'name:asc'];
export default createConnector({
  displayName: 'CliniaRefinementList',

  propTypes: {
    id: PropTypes.string,
    property: PropTypes.string.isRequired,
    operator: PropTypes.oneOf(['and', 'or']),
    showMore: PropTypes.bool,
    limit: PropTypes.number,
    showMoreLimit: PropTypes.number,
    defaultRefinement: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    transformItems: PropTypes.func,
  },

  defaultProps: {
    operator: 'or',
    showMore: false,
    limit: 10,
    showMoreLimit: 20,
  },

  getProvidedProps(props, searchState, searchResults, _metadata) {
    const { property } = props;
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

    const items = results.getFacetValues(property, { sortBy }).map(v => ({
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
    const { property, operator } = props;

    const addKey = operator === 'and' ? 'addFacet' : 'addDisjunctiveFacet';
    const addRefinementKey = `${addKey}Refinement`;

    searchParameters = searchParameters.setQueryParameters({
      maxValuesPerFacet: Math.max(
        searchParameters.maxValuesPerFacet || 0,
        getLimit(props)
      ),
    });

    searchParameters = searchParameters[addKey](property);

    return getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    }).reduce(
      (res, val) => res[addRefinementKey](property, val),
      searchParameters
    );
  },

  getMetadata(props, searchState) {
    const id = getId(props);
    const context = {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    };
    return {
      id,
      index: getIndexId(context),
      items:
        getCurrentRefinement(props, searchState, context).length > 0
          ? [
              {
                property: props.property,
                label: `${props.property}: `,
                currentRefinement: getCurrentRefinement(
                  props,
                  searchState,
                  context
                ),
                value: nextState => refine(props, nextState, [], context),
                items: getCurrentRefinement(props, searchState, context).map(
                  item => ({
                    label: `${item}`,
                    value: nextState => {
                      const nextSelectedItems = getCurrentRefinement(
                        props,
                        nextState,
                        context
                      ).filter(other => other !== item);
                      return refine(
                        props,
                        searchState,
                        nextSelectedItems,
                        context
                      );
                    },
                  })
                ),
              },
            ]
          : [],
    };
  },
});
