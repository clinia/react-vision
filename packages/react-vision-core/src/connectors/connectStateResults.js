import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';

/**
 * The `connectStateResults` connector provides a way to access the `searchState` and the `searchResults`
 * of Vision.
 * For instance this connector allows you to create results/noResults or query/noQuery pages.
 * @name connectStateResults
 * @kind connector
 * @providedPropType {object} searchState - The search state of the vision component.
 * @providedPropType {object} searchResults - The search results. <br/><br/> In case of multiple indices: if used under `<Index>`, results will be those of the corresponding index otherwise it'll be those of the root index.
 * @providedPropType {object} allSearchResults - In case of multiple indices you can retrieve all the results
 * @providedPropType {string} error - If the search failed, the error will be logged here.
 * @providedPropType {boolean} searching - If there is a search in progress.
 * @providedPropType {boolean} isSearchStalled - Flag that indicates if React Vision has detected that searches are stalled.
 * @providedPropType {object} props - component props.
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, SearchBox, Hits, connectStateResults } from '@clinia/react-vision-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const Content = connectStateResults(({ searchState, searchResults }) => {
 *   const hasResults = searchResults && searchResults.total !== 0;
 *
 *    return (
 *      <div>
 *        <div hidden={!hasResults}>
 *          <Hits />
 *        </div>
 *        <div hidden={hasResults}>
 *          <div>No results has been found for {searchState.query}</div>
 *        </div>
 *      </div>
 *    );
 * });
 *
 * const App = () => (
 *   <Vision
 *      searchClient={searchClient}
 *      indexName="pharmacy"
 *    >
 *      <SearchBox />
 *      <Content />
 *    </Vision>
 * );
 */
export default createConnector({
  displayName: 'CliniaStateResults',

  getProvidedProps(props, searchState, searchResults) {
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    return {
      searchState,
      searchResults: results,
      allSearchResults: searchResults.results,
      searching: searchResults.searching,
      isSearchStalled: searchResults.isSearchStalled,
      error: searchResults.error,
      props,
    };
  },
});
