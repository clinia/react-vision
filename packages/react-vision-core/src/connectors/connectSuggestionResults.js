import createConnector from '../core/createConnector';

function getResults(searchForSuggestionsResults) {
  if (
    searchForSuggestionsResults &&
    searchForSuggestionsResults.results &&
    searchForSuggestionsResults.results.suggestions
  ) {
    return searchForSuggestionsResults.results;
  }

  return null;
}

/**
 * The `connectSuggestionsResults` connector provides a way to access the `suggestionResults`
 * of Vision.
 * For instance this connector allows you to create show the suggestions in another component.
 * @name connectSuggestionsResults
 * @kind connector
 * @providedPropType {object} searchState - The search state of the instant search component. <br/><br/> See: [Search state structure](https://community.algolia.com/react-instantsearch/guide/Search_state.html)
 * @providedPropType {object} suggestionResults - The suggestions results.
 * @providedPropType {string} error - If the search for suggestions failed, the error will be logged here.
 * @providedPropType {boolean} searchingForSuggestions - If there is a search for suggestions in progress.
 * @providedPropType {boolean} isSearchStalled - Flag that indicates if React Vision has detected that searches are stalled.
 * @providedPropType {object} props - component props.
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, AutoComplete, connectStateResults } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *   'TODO',
 *   'test'
 * );
 *
 * const Content = connectSuggestionsResults(({ suggestionResults }) => {
 *   const hasSuggestions = suggestionResults && suggestionResults.length !== 0;
 *
 *    return (
 *      <div>
 *        {suggestionResults.map(suggestion => <div key={suggestion.suggestion}>{suggestions.suggestion}</div>)}
 *      </div>
 *    );
 * });
 *
 * const App = () => (
 *   <Vision
 *      searchClient={searchClient}
 *      indexName="health_facility"
 *    >
 *      <AutoComplete />
 *      <Content />
 *    </InstantSearch>
 * );
 */
export default createConnector({
  displayName: 'CliniaSuggestionResults',

  getProvidedProps(
    props,
    _searchState,
    _searchResults,
    _meta,
    searchForSuggestionsResults
  ) {
    const results = getResults(searchForSuggestionsResults);

    return {
      suggestionResults: results,
      searching: searchForSuggestionsResults.searching,
      isSearchStalled: searchForSuggestionsResults.isSearchStalled,
      error: searchForSuggestionsResults.error,
      props,
    };
  },
});
