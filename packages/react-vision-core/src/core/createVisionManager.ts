import cliniasearchHelper from 'cliniasearch-helper';
import createWidgetsManager from './createWidgetsManager';
import createStore from './createStore';
import { HIGHLIGHT_TAGS } from './highlight';
import { hasMultipleIndices } from './indexUtils';
import { version as ReactVersion } from 'react';
import version from './version';

function addCliniaAgents(searchClient) {
  if (typeof searchClient.addCliniaAgent === 'function') {
    searchClient.addCliniaAgent(`react (${ReactVersion})`);
    searchClient.addCliniaAgent(`react-vision (${version})`);
  }
}

const isMultiIndexContext = widget =>
  hasMultipleIndices({
    vci: widget.props.contextValue,
    multiIndexContext: widget.props.indexContextValue,
  });
const isTargetedIndexEqualIndex = (widget, indexId) =>
  widget.props.indexContextValue.targetedIndex === indexId;

const isIndexWidget = widget => Boolean(widget.props.indexId);
const isIndexWidgetEqualIndex = (widget, indexId) =>
  widget.props.indexId === indexId;

const sortIndexWidgetsFirst = (firstWidget, secondWidget) => {
  if (isIndexWidget(firstWidget)) {
    return -1;
  }
  if (isIndexWidget(secondWidget)) {
    return 1;
  }
  return 0;
};

/**
 * Creates a new instance of the VisionManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the clinia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {VisionManager} a new instance of VisionManager
 */
export default function createVisionManager({
  indexName,
  initialState = {},
  searchClient,
  resultsState,
  stalledSearchDelay,
}) {
  const helper = cliniasearchHelper(searchClient, indexName, {
    ...HIGHLIGHT_TAGS,
  });

  addCliniaAgents(searchClient);

  helper
    .on('search', handleNewSearch)
    .on('result', handleSearchSuccess({ indexId: indexName }))
    .on('error', handleSearchError);

  let locationClient = searchClient.initPlaces();

  let skip = false;
  let stalledSearchTimer: NodeJS.Timeout | null = null;
  let initialSearchParameters = helper.state;

  const widgetsManager = createWidgetsManager(onWidgetsUpdate);

  hydrateSearchClient(searchClient, resultsState);

  const store = createStore({
    widgets: initialState,
    metadata: [],
    results: hydrateResultsState(resultsState),
    resultsSuggestions: null,
    resultsLocations: null,
    error: null,
    searching: false,
    searchingForSuggestions: false,
    searchingForLocations: false,
    isSearchStalled: true,
  });

  function skipSearch() {
    skip = true;
  }

  function updateClient(client) {
    addCliniaAgents(client);
    helper.setClient(client);
    search();
  }

  function clearCache() {
    helper.clearCache();
    search();
  }

  function getMetadata(state) {
    return widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getMetadata))
      .map(widget => widget.getMetadata(state));
  }

  function getSearchParameters() {
    const sharedParameters = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => !isMultiIndexContext(widget) && !isIndexWidget(widget))
      .reduce(
        (res, widget) => widget.getSearchParameters(res),
        initialSearchParameters
      );

    const mainParameters = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => {
        const targetedIndexEqualMainIndex =
          isMultiIndexContext(widget) &&
          isTargetedIndexEqualIndex(widget, indexName);

        const subIndexEqualMainIndex =
          isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);

        return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
      })
      .sort(sortIndexWidgetsFirst)
      .reduce(
        (res, widget) => widget.getSearchParameters(res),
        sharedParameters
      );

    const derivedIndices = widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.getSearchParameters))
      .filter(widget => {
        const targetedIndexNotEqualMainIndex =
          isMultiIndexContext(widget) &&
          !isTargetedIndexEqualIndex(widget, indexName);

        const subIndexNotEqualMainIndex =
          isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);

        return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
      })
      .sort(sortIndexWidgetsFirst)
      .reduce((indices, widget) => {
        const indexId = isMultiIndexContext(widget)
          ? widget.props.indexContextValue.targetedIndex
          : widget.props.indexId;

        const widgets = indices[indexId] || [];

        return { ...indices, [indexId]: widgets.concat(widget) };
      }, {});

    const derivedParameters = Object.keys(derivedIndices).map(indexId => ({
      parameters: derivedIndices[indexId].reduce(
        (res, widget) => widget.getSearchParameters(res),
        sharedParameters
      ),
      indexId,
    }));

    return { mainParameters, derivedParameters };
  }

  function onSearchForSuggestions({ query, args }) {
    store.setState({
      ...store.getState(),
      searchingForSuggestions: true,
    });

    searchClient
      .suggest(query, args)
      .then(content => {
        store.setState({
          ...store.getState(),
          searchingForSuggestions: false,
          resultsSuggestions: {
            suggestions: content,
            query,
          },
        });
      })
      .catch(error => {
        // Since setState is synchronous, any error that occurs in the render of a
        // component will be swallowed by this promise.
        // This is a trick to make the error show up correctly in the console.
        // See http://stackoverflow.com/a/30741722/969302
        setTimeout(() => {
          throw error;
        });
      });
  }

  function onSearchForLocations({ query, ...args }) {
    store.setState({
      ...store.getState(),
      searchingForLocations: true,
    });

    if (locationClient) {
      locationClient!
        .suggest(query, args)
        .then(content => {
          store.setState({
            ...store.getState(),
            searchingForLocations: false,
            resultsLocations: {
              suggestions: content,
              query,
            },
          });
        })
        .catch(error => {
          // Since setState is synchronous, any error that occurs in the render of a
          // component will be swallowed by this promise.
          // This is a trick to make the error show up correctly in the console.
          // See http://stackoverflow.com/a/30741722/969302
          setTimeout(() => {
            throw error;
          });
        });
    }
  }

  function search() {
    if (skip) return;

    const { mainParameters, derivedParameters } = getSearchParameters();

    helper.derivedHelpers.slice().forEach(derivedHelper => {
      derivedHelper.detach();
    });

    derivedParameters.forEach(({ indexId, parameters }) => {
      const derivedHelper = helper.derive(() => parameters);

      derivedHelper
        .on('result', handleSearchSuccess({ indexId }))
        .on('error', handleSearchError);
    });

    helper.setState(mainParameters);

    helper.search();
  }

  function handleSearchSuccess({ indexId }) {
    return event => {
      const state = store.getState();
      const isDerivedHelperEmpty = !helper.derivedHelpers.length;

      let results = state.results ? state.results : {};

      if (!isDerivedHelperEmpty) {
        results[indexId] = event;
      } else {
        results = event;
      }

      const currentState = store.getState();
      let nextIsSearchStalled = currentState.isSearchStalled;
      if (!helper.hasPendingRequests()) {
        clearTimeout(stalledSearchTimer!);
        stalledSearchTimer = null;
        nextIsSearchStalled = false;
      }

      const { ...partialState } = currentState;

      store.setState({
        ...partialState,
        results,
        isSearchStalled: nextIsSearchStalled,
        searching: false,
        error: null,
      });
    };
  }

  function handleSearchError({ error }) {
    const currentState = store.getState();

    let nextIsSearchStalled = currentState.isSearchStalled;
    if (!helper.hasPendingRequests()) {
      clearTimeout(stalledSearchTimer!);
      nextIsSearchStalled = false;
    }

    const { ...partialState } = currentState;

    store.setState({
      ...partialState,
      isSearchStalled: nextIsSearchStalled,
      error,
      searching: false,
    });
  }

  function handleNewSearch() {
    if (stalledSearchTimer) return;

    stalledSearchTimer = setTimeout(() => {
      const { ...partialState } = store.getState();

      store.setState({
        ...partialState,
        isSearchStalled: true,
      });
    }, stalledSearchDelay);
  }

  function hydrateSearchClient(client, results) {
    if (!results) return;

    if (!client._useCache || typeof client.addCliniaAgent !== 'function') {
      // Avoid hydrating the client when cache is disable or the client is not ours
      return;
    }

    if (Array.isArray(results)) {
      hydrateSearchClientWithMultiIndexRequest(client, results);
      return;
    }

    hydrateSearchClientWithSingleIndexRequest(client, results);
  }

  function hydrateSearchClientWithMultiIndexRequest(client, results) {
    const key = `/1/indexes/*/queries_body_${JSON.stringify({
      requests: results.reduce((acc, result) =>
        acc.concat(
          result.rawResults.map(request => ({
            indexName: request.index,
            params: request.params,
          }))
        )
      ),
    })}`;

    client.cache = {
      ...client.cache,
      [key]: JSON.stringify({
        results: results.reduce(
          (acc, result) => acc.concat(result.rawResults),
          []
        ),
      }),
    };
  }

  function hydrateSearchClientWithSingleIndexRequest(client, results) {
    const key = `/1/indexes/*/queries_body_${JSON.stringify({
      requests: results.rawResults.map(request => ({
        indexName: request.index,
        params: request.params,
      })),
    })}`;

    client.cache = {
      ...client.cache,
      [key]: JSON.stringify({
        results: results.rawResults,
      }),
    };
  }

  function hydrateResultsState(results) {
    if (!results) return null;

    if (Array.isArray(results)) {
      return results.reduce(
        (acc, result) => ({
          ...acc,
          [result._internalIndexId]: new cliniasearchHelper.SearchResults(
            new cliniasearchHelper.SearchParameters(result.state),
            result.rawResults
          ),
        }),
        {}
      );
    }

    return new cliniasearchHelper.SearchResults(
      new cliniasearchHelper.SearchParameters(results.state),
      results.rawResults
    );
  }

  // Called whenever a widget has been rendered with new props.
  function onWidgetsUpdate() {
    const metadata = getMetadata(store.getState().widgets);

    store.setState({
      ...store.getState(),
      metadata,
      searching: true,
    });

    // Since the `getSearchParameters` method of widgets also depends on props,
    // the result search parameters might have changed.
    search();
  }

  function transitionState(nextSearchState) {
    const searchState = store.getState().widgets;

    return widgetsManager
      .getWidgets()
      .filter(widget => Boolean(widget.transitionState))
      .reduce(
        (res, widget) => widget.transitionState(searchState, res),
        nextSearchState
      );
  }

  function onExternalStateUpdate(nextSearchState) {
    const metadata = getMetadata(nextSearchState);

    store.setState({
      ...store.getState(),
      widgets: nextSearchState,
      metadata,
      searching: true,
    });

    search();
  }

  function updateIndex(newIndex) {
    initialSearchParameters = initialSearchParameters.setIndex(newIndex);
    // No need to trigger a new search here as the widgets will also update and trigger it if needed.
  }

  function getWidgetsIds() {
    return store
      .getState()
      .metadata.reduce(
        (res, meta) =>
          typeof meta.id !== 'undefined' ? res.concat(meta.id) : res,
        []
      );
  }

  return {
    store,
    widgetsManager,
    getWidgetsIds,
    getSearchParameters,
    onSearchForSuggestions,
    onSearchForLocations,
    onExternalStateUpdate,
    transitionState,
    updateClient,
    updateIndex,
    clearCache,
    skipSearch,
  };
}

export type VisionManager = ReturnType<typeof createVisionManager>;
