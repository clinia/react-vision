import connect from '../connectStateResults';

jest.mock('../../core/createConnector', () => x => x);

describe('connectStateResults', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    it('provides the correct props to the component', () => {
      const searchState = { state: 'state' };
      const error = 'error';
      const searching = true;
      const isSearchStalled = true;
      const searchResults = {
        results: { total: 25, hits: [] },
        error,
        searching,
        isSearchStalled,
      };

      const expectation = {
        searchState,
        searchResults: searchResults.results,
        allSearchResults: searchResults.results,
        props: { props: 'props', contextValue },
        error,
        searching,
        isSearchStalled,
      };

      const actual = connect.getProvidedProps(
        { props: 'props', contextValue },
        searchState,
        searchResults
      );

      expect(actual).toEqual(expectation);
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    it('provides the correct props to the component', () => {
      const searchState = { state: 'state' };
      const error = 'error';
      const searching = true;
      const isSearchStalled = true;
      const searchResults = {
        results: {
          first: { total: 25, hits: [] },
          second: { total: 26, hits: [] },
        },
        error,
        searching,
        isSearchStalled,
      };

      const expectation = {
        searchState,
        searchResults: searchResults.results.second,
        allSearchResults: searchResults.results,
        props: { props: 'props', contextValue, indexContextValue },
        error,
        searching,
        isSearchStalled,
      };

      const actual = connect.getProvidedProps(
        { props: 'props', contextValue, indexContextValue },
        searchState,
        searchResults
      );

      expect(actual).toEqual(expectation);
    });
  });
});
