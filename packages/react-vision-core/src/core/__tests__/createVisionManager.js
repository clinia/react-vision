import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import cliniasearch from 'cliniasearch/lite';
import { SearchResults } from 'cliniasearch-helper';
import createVisionManager from '../createVisionManager';
import { Vision, Index, SortBy, Configure } from 'react-vision-dom';

Enzyme.configure({ adapter: new Adapter() });

jest.useFakeTimers();

const runAllMicroTasks = () => new Promise(setImmediate);
const runONlyNextMicroTask = () => new Promise.resolve();

const createSearchClient = () => ({
  search: jest.fn(() =>
    Promise.resolve({
      results: [
        {
          params: 'query=&hitsPerPage=16&page=0&facets=%5B%5D&tagFilters=',
          page: 0,
          hits: [],
          hitsPerPage: 10,
          nbPages: 0,
          processingTimeMS: 4,
          query: '',
          nbHits: 0,
          index: 'index',
        },
      ],
    })
  ),
});

describe('createVisionManager', () => {
  it('initializes the manager with an empty state', () => {
    const vm = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    expect(vm.store.getState()).toEqual({
      error: null,
      isSearchStalled: true,
      metadata: [],
      results: null,
      search: false,
      searchForFacetValues: false,
      widgets: {},
    });

    expect(vm.widgetsManager.getWidgets()).toEqual([]);

    expect(vm.transitionState({})).toEqual({});

    expect(vm.getWidgetsIds()).toEqual([]);
  });

  describe('client hydratation', () => {
    it('hydrates the `searchClient` for a single index results', () => {
      const searchClient = cliniasearch('appId', 'appKey', {
        _cache: true, // cache is not enabled inside node
      });

      const resultsState = {
        rawResults: [
          {
            index: 'index',
            query: 'query',
          },
        ],
        state: {
          index: 'index',
          query: 'query',
        },
      };

      expect(Object.keys(searchClient.cache)).toHaveLength(0);

      createVisionManager({
        indexName: 'index',
        searchClient,
        resultsState,
      });

      expect(Object.keys(searchClient.cache)).toHaveLength(1);
      Object.keys(searchClient.cache).forEach(key => {
        expect(typeof searchClient.cache[key]).toBe('string');
        expect(JSON.parse(searchClient.cache[key])).toEqual({
          results: [
            {
              index: 'index',
              query: 'query',
            },
          ],
        });
      });
    });

    it('hydrates the `searchClient` for a multi index results', () => {
      const searchClient = cliniasearch('appId', 'apiKey', {
        _cache: true,
      });

      const resultsState = [
        {
          _internalIndexId: 'index1',
          rawResults: [
            {
              index: 'index1',
              query: 'query1',
            },
          ],
          state: {
            index: 'index1',
            query: 'query1',
          },
        },
        {
          _internalIndexId: 'index2',
          rawResults: [
            {
              index: 'index2',
              query: 'query2',
            },
          ],
          state: {
            index: 'index2',
            query: 'query2',
          },
        },
      ];

      expect(Object.keys(searchClient.cache)).toHaveLength(0);

      createVisionManager({
        indexName: 'index',
        searchClient,
        resultsState,
      });

      expect(Object.keys(searchClient.cache)).toHaveLength(1);
      Object.keys(searchClient.cache).forEach(key => {
        expect(typeof searchClient.cache[key]).toBe('string');
        expect(JSON.parse(searchClient.cache[key])).toEqual({
          results: [
            {
              index: 'index1',
              query: 'query1',
            },
            {
              index: 'index2',
              query: 'query2',
            },
          ],
        });
      });
    });
  });
});
