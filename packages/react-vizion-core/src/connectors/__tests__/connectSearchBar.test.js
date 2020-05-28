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
          currentQueryRefinement: '',
          querySuggestionHits: [],
          currentLocationRefinement: null,
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

      describe('currentLocationRefinement', () => {
        it('expect to return the location position from the searchState (aroundLatLng)', () => {
          const props = { contextValue };
          const searchResults = createSingleIndexSearchResults();
          const searchState = {
            location: {
              name: 'Montreal',
              position: {
                lat: 45.5017,
                lng: 73.5673,
              },
            },
          };

          const actual = connector.getProvidedProps(
            props,
            searchState,
            searchResults
          );

          expect(actual.currentLocationRefinement).toEqual({
            name: 'Montreal',
            position: {
              lat: 45.5017,
              lng: 73.5673,
            },
          });
        });

        it('expect to return the location position from the SearchResults', () => {
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

          expect(actual.currentLocationRefinement).toEqual({
            name: '',
            position: {
              lat: 47,
              lng: 74,
            },
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

          expect(actual.currentLocationRefinement).toBe(null);
        });
      });

      describe('currentQueryRefinement', () => {});

      describe('querySuggestionsProps defaultRefinment', () => {
        it('supports defaultRefinement', () => {
          const actual = connector.getProvidedProps(
            {
              querySuggestionsProps: { defaultRefinement: 'yaw' },
              contextValue,
            },
            {},
            {}
          );

          expect(actual.currentQueryRefinement).toEqual('yaw');
        });
      });

      describe('geocoderProps defaultRefinment', () => {
        it('supports defaultRefinement', () => {
          const actual = connector.getProvidedProps(
            {
              geocoderProps: {
                defaultRefinement: { name: '', position: { lat: 10, lng: 20 } },
              },
              contextValue,
            },
            {},
            {}
          );

          expect(actual.currentLocationRefinement).toEqual({
            name: '',
            position: { lat: 10, lng: 20 },
          });
        });
      });
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

      it('expect to set aroundLatLng when location is provided', () => {
        const props = { contextValue };
        const searchState = {};
        const nextRefinement = {
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to replace the previous value when location is provided', () => {
        const props = { contextValue };
        const searchState = {
          location: {
            name: 'Quebec',
            position: {
              lat: 10,
              lng: 20,
            },
          },
          aroundLatLng: {
            lat: 10,
            lng: 20,
          },
        };
        const nextRefinement = {
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to clear the previous value when location is omit', () => {
        const props = { contextValue };
        const searchState = {
          location: {
            name: 'Quebec',
            position: {
              lat: 10,
              lng: 20,
            },
          },
          aroundLatLng: {
            lat: 10,
            lng: 20,
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

      it('expect to set the query and location when both are provided', () => {
        const props = { contextValue };
        const searchState = {};
        const nextRefinement = {
          query: 'test',
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to replace the previous values when both query and location provided', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
          location: {
            name: 'Quebec',
            position: {
              lat: 10,
              lng: 20,
            },
          },
          aroundLatLng: {
            lat: 10,
            lng: 20,
          },
        };
        const nextRefinement = {
          query: 'test',
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
        };

        const actual = connector.refine(props, searchState, nextRefinement);

        expect(actual).toEqual({
          page: 1,
          query: 'test',
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
          },
          aroundLatLng: {
            lat: 47,
            lng: 74,
          },
        });
      });

      it('expect to clear the previous values when query and location are omit', () => {
        const props = { contextValue };
        const searchState = {
          query: 'initial',
          location: {
            name: 'Montreal',
            position: {
              lat: 47,
              lng: 74,
            },
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
