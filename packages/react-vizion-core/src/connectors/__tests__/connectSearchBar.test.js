import { SearchResults, SearchParameters } from '@clinia/search-helper';
import connector from '../connectSearchBar';

jest.mock('../../core/createConnector', () => x => x);

describe('connectGeoSearch', () => {
  const empty = {};

  describe('single index', () => {
    const contextValue = {
      mainTargetedIndex: 'index',
    };

    const createSingleIndexSearchResults = (
      { hits = [], querySuggestionHits = [], locationHits = [] } = {},
      state
    ) => ({
      results: new SearchResults(new SearchParameters(state), [
        {
          meta: {},
          hits,
        },
      ]),
      resultsQuerySuggestions: { meta: {}, hits: querySuggestionHits },
      resultsLocations: locationHits,
    });

    describe('getProvidedProps', () => {
      it('expect to return default provided props', () => {
        const props = { contextValue };
        const searchState = {};
        const searchResults = empty;

        const actual = connector.getProvidedProps(
          props,
          searchState,
          searchResults
        );

        const expectation = {
          queryCurrentRefinement: '',
          querySuggestionHits: [],
          currentPositionRefinement: null,
          locationHits: [],
        };

        expect(actual).toEqual(expectation);
      });

      it('expect to return locationHits and querySuggestionHits when we have resultsLocations and resultsQuerySuggestions', () => {
        const hits = [
          { id: '1', query: '1' },
          { id: '2', query: '2' },
          { id: '3', query: '3' },
          { id: '4', query: '4' },
        ];

        const props = { contextValue };
        const searchState = {};
        const searchResults = createSingleIndexSearchResults({
          locationHits: [{ id: 'location1', formattedAddress: 'test test' }],
          querySuggestionHits: hits,
        });

        const actual = connector.getProvidedProps(
          props,
          searchState,
          searchResults
        );

        const querySuggestionsHitsExpectation = [
          { id: '1', query: '1' },
          { id: '2', query: '2' },
          { id: '3', query: '3' },
          { id: '4', query: '4' },
        ];

        const locationsHitsExpectation = [
          { id: 'location1', formattedAddress: 'test test' },
        ];

        expect(actual.querySuggestionHits).toEqual(
          querySuggestionsHitsExpectation
        );
        expect(actual.locationHits).toEqual(locationsHitsExpectation);
      });

      describe('querySuggestionHits', () => {
        it('expect to return querySuggestionHits when we have resultsQuerySuggestions', () => {
          const hits = [
            { id: '1', query: '1' },
            { id: '2', query: '2' },
            { id: '3', query: '3' },
            { id: '4', query: '4' },
          ];

          const props = { contextValue };
          const searchState = {};
          const searchResults = createSingleIndexSearchResults({
            querySuggestionHits: hits,
          });

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          const expectation = [
            { id: '1', query: '1' },
            { id: '2', query: '2' },
            { id: '3', query: '3' },
            { id: '4', query: '4' },
          ];

          expect(actual.querySuggestionHits).toEqual(expectation);
        });

        it("expect to return empty querySuggestionHits when we don't have resultsQuerySuggestions", () => {
          const props = { contextValue };
          const searchState = {};
          const searchResults = empty;

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          const expectation = [];

          expect(actual.querySuggestionHits).toEqual(expectation);
          expect(actual.locationHits).toEqual(expectation);
        });
      });

      describe('locationHits', () => {
        it('expect to return locationHits when we have resultsLocations', () => {
          const hits = [
            { id: '1', query: '1' },
            { id: '2', query: '2' },
            { id: '3', query: '3' },
            { id: '4', query: '4' },
          ];

          const props = { contextValue };
          const searchState = {};
          const searchResults = createSingleIndexSearchResults({
            locationHits: hits,
          });

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          const expectation = [
            { id: '1', query: '1' },
            { id: '2', query: '2' },
            { id: '3', query: '3' },
            { id: '4', query: '4' },
          ];

          expect(actual.locationHits).toEqual(expectation);
        });

        it("expect to return empty locationHits when we don't have resultsLocations", () => {
          const props = { contextValue };
          const searchState = {};
          const searchResults = empty;

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          const expectation = [];

          expect(actual.locationHits).toEqual(expectation);
        });
      });

      describe('currentPositionRefinement', () => {
        it('expect to return the position from the searchState (aroundLatLng)', () => {
          const props = { contextValue };
          const searchResults = createSingleIndexSearchResults();
          const searchState = {
            aroundLatLng: {
              lat: 47,
              lng: 74,
            },
          };

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          expect(actual.currentPositionRefinement).toEqual({
            lat: 47,
            lng: 74,
          });
        });

        it('expect to return the position from the SearchResults', () => {
          const props = { contextValue };
          const searchState = {};
          const searchResults = createSingleIndexSearchResults([], {
            aroundLatLng: '47, 74',
          });

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          expect(actual.currentPositionRefinement).toEqual({
            lat: 47,
            lng: 74,
          });
        });

        it('expect to return null from an empty searchState', () => {
          const props = { contextValue };
          const searchState = {};
          const searchResults = createSingleIndexSearchResults();

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          expect(actual.currentPositionRefinement).toBe(null);
        });
      });

      describe('currentQueryRefinement', () => {});
    });

    describe('refine', () => {
      it('expect to set the query when query is provided', () => {
        const props = { contextValue };
        const searchState = {};
        const nextRefinement = {
          query: 'test',
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
        });
      });

      it('expect to replace the previous value when query is provided', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
        };
        const nextRefinement = {
          query: 'test',
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
        });
      });

      it('expect to clear the previous value when query is omit', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
        };

        let nextRefinement = {};
        let actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        nextRefinement = {
          query: null,
        };
        actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, null);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, undefined);
        expect(actual).toEqual({
          page: 1,
        });
      });

      it('expect to set aroundLatLng when aroundLatLng is provided', () => {
        const props = { contextValue };
        const searchState = {};
        const nextRefinement = {
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to replace the previous value when aroundLatLng is provided', () => {
        const props = { contextValue };
        const searchState = {
          aroundLatLng: {
            lat: 10,
            lng: 20,
          },
        };
        const nextRefinement = {
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to clear the previous value when aroundLatLng is omit', () => {
        const props = { contextValue };
        const searchState = {
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        let nextRefinement = {};
        let actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        nextRefinement = {
          aroundLatLng: null,
        };
        actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, null);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, undefined);
        expect(actual).toEqual({
          page: 1,
        });
      });

      it('expect to set the query and aroundLatLng when both are provided', () => {
        const props = { contextValue };
        const searchState = {};
        const nextRefinement = {
          query: 'test',
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to replace the preivous values when both query and aroundLatLng provided', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
          aroundLatLng: {
            lat: 10,
            lng: 20,
          },
        };
        const nextRefinement = {
          query: 'test',
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to clear the previous values when query and aroundLatLng are omit', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        let nextRefinement = {};
        let actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        // Query specific

        nextRefinement = {
          query: null,
        };
        actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, null);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, undefined);
        expect(actual).toEqual({
          page: 1,
        });

        // AroundLatLng specific

        nextRefinement = {
          aroundLatLng: null,
        };
        actual = connector.refine(props, searchState, nextRefinement);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, null);
        expect(actual).toEqual({
          page: 1,
        });

        actual = connector.refine(props, searchState, undefined);
        expect(actual).toEqual({
          page: 1,
        });
      });
    });

    describe('getSearchParameters', () => {
      it('expect to set the parameter "query" when query is provided', () => {
        const searchParameters = new SearchParameters();
        const props = { contextValue };
        const searchState = {
          query: 'test',
        };

        const actual = connector.getSearchParameters(
          searchParameters,
          props,
          searchState
        );

        const expectation = 'test';

        expect(actual.query).toEqual(expectation);
      });

      it('expect to return the given searchParameters when query is omit', () => {
        const searchParameters = new SearchParameters({
          aroundLatLng: '47,74',
        });
        const props = { contextValue };
        const searchState = {
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.getSearchParameters(
          searchParameters,
          props,
          searchState
        );

        expect(actual).toEqual(searchParameters);
      });

      it('expect to set the parameter "aroundLatLng" when aroundLatLng is provided', () => {
        const searchParameters = new SearchParameters();
        const props = { contextValue };
        const searchState = {
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        };

        const actual = connector.getSearchParameters(
          searchParameters,
          props,
          searchState
        );

        const expectation = '47,74';

        expect(actual.aroundLatLng).toEqual(expectation);
      });

      it('expect to return the given searchParameters when aroundLatLng is omit', () => {
        const searchParameters = new SearchParameters({ query: 'test' });
        const props = { contextValue };
        const searchState = {
          query: 'test',
        };

        const actual = connector.getSearchParameters(
          searchParameters,
          props,
          searchState
        );

        expect(actual).toEqual(searchParameters);
      });
    });
  });
});
