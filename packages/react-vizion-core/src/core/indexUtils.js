import { omit } from './utils';

export function getIndexId(context) {
  return hasMultipleIndices(context)
    ? context.multiIndexContext.targetedIndex
    : context.cvi.mainTargetedIndex;
}

export function getResults(searchResults, context) {
  if (searchResults.results) {
    if (searchResults.results.hits) {
      return searchResults.results;
    }

    const indexId = getIndexId(context);
    if (searchResults.results[indexId]) {
      return searchResults.results[indexId];
    }
  }

  return null;
}

export function hasMultipleIndices(context) {
  return context && context.multiIndexContext;
}

export function refineValue(
  searchState,
  nextRefinement,
  context,
  resetPage,
  namespace
) {
  if (hasMultipleIndices(context)) {
    const indexId = getIndexId(context);
    return namespace
      ? refineMultiIndexWithNamespace(
          searchState,
          nextRefinement,
          indexId,
          resetPage,
          namespace
        )
      : refineMultiIndex(searchState, nextRefinement, indexId, resetPage);
  } else {
    // When we have a multi index page with shared widgets we should also
    // reset their page to 1 if the resetPage is provided. Otherwise the
    // indices will always be reset
    if (searchState.indices && resetPage) {
      Object.keys(searchState.indices).forEach(targetedIndex => {
        searchState = refineValue(
          searchState,
          { page: 1 },
          { multiIndexContext: { targetedIndex } },
          true,
          namespace
        );
      });
    }
    return namespace
      ? refineSingleIndexWithNamespace(
          searchState,
          nextRefinement,
          resetPage,
          namespace
        )
      : refineSingleIndex(searchState, nextRefinement, resetPage);
  }
}

function refineMultiIndex(searchState, nextRefinement, indexId, resetPage) {
  const page = resetPage ? { page: 1 } : undefined;
  const state =
    searchState.indices && searchState.indices[indexId]
      ? {
          ...searchState.indices,
          [indexId]: {
            ...searchState.indices[indexId],
            ...nextRefinement,
            ...page,
          },
        }
      : {
          ...searchState.indices,
          [indexId]: {
            ...nextRefinement,
            ...page,
          },
        };

  return {
    ...searchState,
    indices: state,
  };
}

function refineSingleIndex(searchState, nextRefinement, resetPage) {
  const page = resetPage ? { page: 1 } : undefined;
  return { ...searchState, ...nextRefinement, ...page };
}

function refineMultiIndexWithNamespace(
  searchState,
  nextRefinement,
  indexId,
  resetPage,
  namespace
) {
  const page = resetPage ? { page: 1 } : undefined;
  const state =
    searchState.indices && searchState.indices[indexId]
      ? {
          ...searchState.indices,
          [indexId]: {
            ...searchState.indices[indexId],
            [namespace]: {
              ...searchState.indices[indexId][namespace],
              ...nextRefinement,
            },
            page: 1,
          },
        }
      : {
          ...searchState.indices,
          [indexId]: {
            [namespace]: nextRefinement,
            ...page,
          },
        };

  return {
    ...searchState,
    indices: state,
  };
}

function refineSingleIndexWithNamespace(
  searchState,
  nextRefinement,
  resetPage,
  namespace
) {
  const page = resetPage ? { page: 1 } : undefined;
  return {
    ...searchState,
    [namespace]: { ...searchState[namespace], ...nextRefinement },
    ...page,
  };
}

function getNamespaceAndPropertyName(id) {
  const parts = id.match(/^([^.]*)\.(.*)/);
  const namespace = parts && parts[1];
  const propertyName = parts && parts[2];

  return { namespace, propertyName };
}

function hasRefinements({
  multiIndex,
  indexId,
  namespace,
  propertyName,
  id,
  searchState,
}) {
  if (multiIndex && namespace) {
    return (
      searchState.indices &&
      searchState.indices[indexId] &&
      searchState.indices[indexId][namespace] &&
      Object.hasOwnProperty.call(
        searchState.indices[indexId][namespace],
        propertyName
      )
    );
  }

  if (multiIndex) {
    return (
      searchState.indices &&
      searchState.indices[indexId] &&
      Object.hasOwnProperty.call(searchState.indices[indexId], id)
    );
  }

  if (namespace) {
    return (
      searchState[namespace] &&
      Object.hasOwnProperty.call(searchState[namespace], propertyName)
    );
  }

  return Object.hasOwnProperty.call(searchState, id);
}

function getRefinements({
  multiIndex,
  indexId,
  namespace,
  propertyName,
  id,
  searchState,
}) {
  if (multiIndex && namespace) {
    return searchState.indices[indexId][namespace][propertyName];
  }
  if (multiIndex) {
    return searchState.indices[indexId][id];
  }
  if (namespace) {
    return searchState[namespace][propertyName];
  }

  return searchState[id];
}

export function getCurrentRefinementValue(
  props,
  searchState,
  context,
  id,
  defaultValue
) {
  const indexId = getIndexId(context);
  const { namespace, propertyName } = getNamespaceAndPropertyName(id);
  const multiIndex = hasMultipleIndices(context);
  const args = {
    multiIndex,
    indexId,
    namespace,
    propertyName,
    id,
    searchState,
  };
  const hasRefinementsValue = hasRefinements(args);

  if (hasRefinementsValue) {
    return getRefinements(args);
  }

  if (props.defaultRefinement) {
    return props.defaultRefinement;
  }

  return defaultValue;
}

export function cleanUpValue(searchState, context, id) {
  const indexId = getIndexId(context);
  const { namespace, propertyName } = getNamespaceAndPropertyName(id);

  if (hasMultipleIndices(context) && Boolean(searchState.indices)) {
    return cleanUpValueWithMultiIndex({
      property: propertyName,
      searchState,
      indexId,
      id,
      namespace,
    });
  }

  return cleanUpValueWithSingleIndex({
    property: propertyName,
    searchState,
    id,
    namespace,
  });
}

function cleanUpValueWithSingleIndex({ searchState, id, namespace, property }) {
  if (namespace) {
    return {
      ...searchState,
      [namespace]: omit(searchState[namespace], [property]),
    };
  }

  return omit(searchState, [id]);
}

function cleanUpValueWithMultiIndex({
  searchState,
  indexId,
  id,
  namespace,
  property,
}) {
  const indexSearchState = searchState.indices[indexId];

  if (namespace && indexSearchState) {
    return {
      ...searchState,
      indices: {
        ...searchState.indices,
        [indexId]: {
          ...indexSearchState,
          [namespace]: omit(indexSearchState[namespace], [property]),
        },
      },
    };
  }

  if (indexSearchState) {
    return {
      ...searchState,
      indices: {
        ...searchState.indices,
        [indexId]: omit(indexSearchState, [id]),
      },
    };
  }

  return searchState;
}
