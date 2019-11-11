import connect from '../connectSuggestionResults';

jest.mock('../../core/createConnector', () => x => x);

describe('connectSuggestionResults', () => {
  const contextValue = { mainTargetedIndex: 'index' };

  it('provides the correct props to the component', () => {
    const searchState = { state: 'state' };
    const searchResults = {};
    const searchForSuggestionResults = {
      results: {
        suggestions: [],
      },
    };

    const expectation = {
      props: { props: 'props', contextValue },
      suggestionResults: searchForSuggestionResults.results,
    };

    const actual = connect.getProvidedProps(
      { props: 'props', contextValue },
      searchState,
      searchResults,
      {},
      searchForSuggestionResults
    );

    expect(actual).toEqual(expectation);
  });
});
