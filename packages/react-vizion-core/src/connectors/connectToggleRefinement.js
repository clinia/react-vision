import PropTypes from 'prop-types';
import { find } from '../core/utils';
import createConnector from '../core/createConnector';
import {
  cleanUpValue,
  getIndexId,
  getResults,
  refineValue,
  getCurrentRefinementValue,
} from '../core/indexUtils';

function getId(props) {
  return props.property;
}

const namespace = 'toggle';

const falsyStrings = ['0', 'false', 'null', 'undefined'];

function getCurrentRefinement(props, searchState, context) {
  const currentRefinement = getCurrentRefinementValue(
    props,
    searchState,
    context,
    `${namespace}.${getId(props)}`,
    false
  );

  if (falsyStrings.indexOf(currentRefinement) !== -1) {
    return false;
  }

  return Boolean(currentRefinement);
}

function refine(props, searchState, nextRefinement, context) {
  const id = getId(props);
  const nextValue = { [id]: nextRefinement ? nextRefinement : false };
  const resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage, namespace);
}

function cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, `${namespace}.${getId(props)}`);
}

/**
 * connectToggleRefinement connector provides the logic to build a widget that will
 * provides an on/off filtering feature based on an property value.
 * @name connectToggleRefinement
 * @kind connector
 * @requirements To use this widget, you'll need an property to toggle on.
 *
 * @propType {string} property - Name of the property on which to apply the `value` refinement. Required when `value` is present.
 * @propType {string} label - Label for the toggle.
 * @propType {string} value - Value of the refinement to apply on `property`.
 * @propType {boolean} [defaultRefinement=false] - Default searchState of the widget. Should the toggle be checked by default?
 * @providedPropType {boolean} currentRefinement - `true` when the refinement is applied, `false` otherwise
 * @providedPropType {object} count - an object that contains the count for `checked` and `unchecked` state
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 */
export default createConnector({
  displayName: 'CliniaToggle',

  propTypes: {
    label: PropTypes.string.isRequired,
    property: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    filter: PropTypes.func,
    defaultRefinement: PropTypes.bool,
  },

  getProvidedProps(props, searchState, searchResults) {
    const { property, value } = props;
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
    const currentRefinement = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    const allFacetValues =
      results && results.getFacetByName(property)
        ? results.getFacetValues(property)
        : null;

    const facetValue =
      // Use null to always be consistent with type of the value
      // count: number | null
      allFacetValues && allFacetValues.length
        ? find(allFacetValues, item => item.name === value.toString())
        : null;

    const facetValueCount = facetValue && facetValue.count;
    const allFacetValuesCount =
      // Use null to always be consistent with type of the value
      // count: number | null
      allFacetValues && allFacetValues.length
        ? allFacetValues.reduce((acc, item) => acc + item.count, 0)
        : null;

    const canRefine = currentRefinement
      ? allFacetValuesCount !== null && allFacetValuesCount > 0
      : facetValueCount !== null && facetValueCount > 0;

    const count = {
      checked: allFacetValuesCount,
      unchecked: facetValueCount,
    };

    return {
      currentRefinement,
      canRefine,
      count,
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
    const { property, value, filter } = props;
    const checked = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    let nextSearchParameters = searchParameters.addDisjunctiveFacet(property);

    if (checked) {
      nextSearchParameters = nextSearchParameters.addDisjunctiveFacetRefinement(
        property,
        value
      );

      if (filter) {
        nextSearchParameters = filter(nextSearchParameters);
      }
    }

    return nextSearchParameters;
  },

  getMetadata(props, searchState) {
    const id = getId(props);
    const checked = getCurrentRefinement(props, searchState, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });
    const items = [];
    const index = getIndexId({
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (checked) {
      items.push({
        label: props.label,
        currentRefinement: checked,
        property: props.property,
        value: nextState =>
          refine(props, nextState, false, {
            cvi: props.contextValue,
            multiIndexContext: props.indexContextValue,
          }),
      });
    }

    return { id, index, items };
  },
});
