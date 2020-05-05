import React from 'react';
import { renderToString } from 'react-dom/server';
import cliniasearchHelper from '@clinia/search-helper';
import { version, HIGHLIGHT_TAGS } from '@clinia/react-vizion-core';

const hasMultipleIndices = context => context && context.multiIndexContext;

const getIndexId = context =>
  hasMultipleIndices(context)
    ? context.multiIndexContext.targetedIndex
    : context.cvi.mainTargetedIndex;

const createSearchParametersCollector = accumulator => {
  return (getWidgetSearchParameters, context, props, searchState) => {
    accumulator.push({
      getSearchParameters: getWidgetSearchParameters,
      index: getIndexId(context),
      context,
      props,
      searchState,
    });
  };
};

const getSearchParameters = (indexName, searchParameters) => {
  const sharedParameters = searchParameters
    .filter(searchParameter => !hasMultipleIndices(searchParameter.context))
    .reduce(
      (acc, searchParameter) =>
        searchParameter.getSearchParameters(
          acc,
          searchParameter.props,
          searchParameter.searchState
        ),
      new cliniasearchHelper.SearchParameters({
        ...HIGHLIGHT_TAGS,
        index: indexName,
      })
    );

  const derivedParameters = searchParameters
    .filter(searchParameter => hasMultipleIndices(searchParameter.context))
    .reduce((acc, searchParameter) => {
      const indexId = getIndexId(searchParameter.context);

      return {
        ...acc,
        [indexId]: searchParameter.getSearchParameters(
          acc[indexId] || sharedParameters,
          searchParameter.props,
          searchParameter.searchState
        ),
      };
    }, {});

  return {
    sharedParameters,
    derivedParameters,
  };
};

const singleIndexSearch = (helper, parameters) =>
  helper.searchOnce(parameters).then(res => ({
    rawResults: res.content._rawResults,
    state: res.content._state,
  }));

const multiIndexSearch = (
  indexName,
  client,
  helper,
  sharedParameters,
  { [indexName]: mainParameters, ...derivedParameters }
) => {
  const indexIds = Object.keys(derivedParameters);

  const searches = [
    helper.searchOnce({
      ...sharedParameters,
      ...mainParameters,
    }),
    ...indexIds.map(indexId => {
      const parameters = derivedParameters[indexId];

      return cliniasearchHelper(client, parameters.index).searchOnce(
        parameters
      );
    }),
  ];

  // We attach `indexId` on the results to be able to reconstruct the object
  // on the client side. We cannot rely on `state.index` anymore because we
  // may have multiple times the same index.
  return Promise.all(searches).then(results =>
    [indexName, ...indexIds].map((indexId, i) => ({
      rawResults: results[i].content._rawResults,
      state: results[i].content._state,
      _internalIndexId: indexId,
    }))
  );
};

export const findResultsState = function(App, props) {
  if (!props) {
    throw new Error(
      'The function `findResultsState` must be called with props: `findResultsState(App, props)`'
    );
  }

  if (!props.searchClient) {
    throw new Error(
      'The props provided to `findResultsState` must have a `searchClient`'
    );
  }

  if (!props.indexName) {
    throw new Error(
      'The props provided to `findResultsState` must have an `indexName`'
    );
  }

  const { indexName, searchClient } = props;

  const searchParameters = [];

  renderToString(
    <App
      {...props}
      onSearchParameters={createSearchParametersCollector(searchParameters)}
    />
  );

  const { sharedParameters, derivedParameters } = getSearchParameters(
    indexName,
    searchParameters
  );

  const helper = cliniasearchHelper(searchClient, sharedParameters.index);

  if (typeof searchClient.addCliniaAgent === 'function') {
    searchClient.addCliniaAgent(`react-vizion-server (${version})`);
  }

  if (Object.keys(derivedParameters).length === 0) {
    return singleIndexSearch(helper, sharedParameters);
  }

  return multiIndexSearch(
    indexName,
    searchClient,
    helper,
    sharedParameters,
    derivedParameters
  );
};
