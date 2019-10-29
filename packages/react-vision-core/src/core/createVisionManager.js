import algoliasearchHelper from 'algoliasearch-helper';
import createWidgetsManager from './createWidgetsManager';
import createStore from './createStore';
import { HIGHLIGHT_TAGS } from './highlight';
import { hasMultipleIndices } from './indexUtils';
import { version as ReactVersion } from 'react';
import version from './version';

function addCliniaAgents(searchClient) {
  if (typeof searchClient.addAlgoliaAgent === 'function') {
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
export default function createInstantSearchManager({
  indexName,
  initialState = {},
  searchClient,
  resultsState,
  stalledSearchDelay,
}) {
  const helper = algoliasearchHelper(searchClient, indexName, {
    ...HIGHLIGHT_TAGS,
  });

  addCliniaAgents(searchClient);

  helper
    .on('search', handleNewSearch)
    .on('result', handleSearchSuccess({ indexId: indexName }))
    .on('error', handleSearchError);

  let skip = false;
  const stalledSearchTimer = null;
  const initialSearchParameters = helper.state;

  const widgetsManager = createWidgetsManager(onWidgetsUpdate);

  hydrateSearchClient(searchClient, resultsState);

  const store = createStore({
    widgets: initialState,
    metadata: [],
    results: hydrateResultsState(resultsState),
    error: null,
    searching: false,
    isSearchStalled: true,
    searchingForFacetValues: false,
  });

  function skipSearch() {
    skip = true;
  }

  return {
    store,
    widgetsManager,
    // getWidgetsIds,
    // getSearchParameters,
    // onSearchForFacetValues,
    // onExternalStateUpdate,
    // transitionState,
    // updateClient,
    // updateIndex,
    // clearCache,
    skipSearch,
  };
}
