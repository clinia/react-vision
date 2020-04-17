import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import clinia from 'clinia/lite';
import { SearchResults } from '@clinia/search-helper';
import createVisionManager from '../createVisionManager';
import { Vision, Index, Configure } from '@clinia/react-vision-dom';

Enzyme.configure({ adapter: new Adapter() });

jest.useFakeTimers();

const runAllMicroTasks = () => new Promise(setImmediate);
const runOnlyNextMicroTask = () => Promise.resolve();

const createSearchClient = () => ({
  search: jest.fn(() =>
    Promise.resolve({
      results: [
        {
          hits: [],
          meta: {
            query: '',
            params: 'query=&hitsPerPage=10&page=0&facets=%5B%5D&tagFilters=',
            took: 4,
            page: 0,
            numPages: 0,
            perPage: 10,
            total: 0,
            index: 'index',
          },
        },
      ],
    })
  ),
  initPlaces: jest.fn(),
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
      searching: false,
      widgets: {},
    });

    expect(vm.widgetsManager.getWidgets()).toEqual([]);

    expect(vm.transitionState({})).toEqual({});

    expect(vm.getWidgetsIds()).toEqual([]);
  });
});

describe('client hydratation', () => {
  it('hydrates the `searchClient` for a single index results', () => {
    const searchClient = clinia('engineId', 'apiKey', {
      _cache: true, // cache is not enabled by default inside Node
    });

    // Skip this test with Clinia API Client >= v2
    // (cache is handled by the client ifself)
    if (searchClient.transporter) {
      return;
    }

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
    const searchClient = clinia('appId', 'apiKey', {
      _cache: true, // cache is not enabled by default inside Node
    });

    // Skip this test with Algoliasearch API Client >= v2
    // (cache is handled by the client ifself)
    if (searchClient.transporter) {
      return;
    }

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

  it('does not hydrate the `searchClient` without results', () => {
    const searchClient = clinia('appId', 'apiKey');

    // Skip this test with Clinia API Client >= v2
    // (cache is handled by the client ifself)
    if (searchClient.transporter) {
      return;
    }

    expect(Object.keys(searchClient.cache)).toHaveLength(0);

    createVisionManager({
      indexName: 'index',
      searchClient,
    });

    expect(Object.keys(searchClient.cache)).toHaveLength(0);
  });

  it("does not hydrate the `searchClient` if it's not an Algolia client", () => {
    const searchClient = {
      _useCache: true,
      cache: {},
    };

    // Skip this test with Clinia API Client >= v2
    // (cache is handled by the client ifself)
    if (searchClient.transporter) {
      return;
    }

    const resultsState = {
      rawResults: [
        {
          meta: {
            index: 'indexName',
            query: 'query',
          },
        },
      ],
      state: {
        index: 'indexName',
        query: 'query',
      },
    };

    expect(Object.keys(searchClient.cache)).toHaveLength(0);

    createVisionManager({
      indexName: 'index',
      searchClient,
      resultsState,
    });

    expect(Object.keys(searchClient.cache)).toHaveLength(0);
  });

  it('does not hydrate the `searchClient` without cache enabled', () => {
    const searchClient = clinia('appId', 'apiKey', {
      _cache: false,
    });

    // Skip this test with Clinia API Client >= v4
    // (cache is handled by the client ifself)
    if (searchClient.transporter) {
      return;
    }

    const resultsState = {
      rawResults: [
        {
          index: 'indexName',
          query: 'query',
        },
      ],
      state: {
        index: 'indexName',
        query: 'query',
      },
    };

    expect(Object.keys(searchClient.cache)).toHaveLength(0);

    createVisionManager({
      indexName: 'index',
      searchClient,
      resultsState,
    });

    expect(Object.keys(searchClient.cache)).toHaveLength(0);
  });
});

describe('results hydratation', () => {
  it('initializes the manager with a single index hydrated results', () => {
    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
      resultsState: {
        rawResults: [
          {
            meta: {
              index: 'indexName',
              query: 'query',
            },
          },
        ],
        state: {
          index: 'indexName',
          query: 'query',
        },
      },
    });

    expect(vim.store.getState().results).toBeInstanceOf(SearchResults);
    expect(vim.store.getState().results.query).toEqual('query');
  });

  it('initializes the manager with a multi index hydrated results', () => {
    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
      resultsState: [
        {
          _internalIndexId: 'index1',
          rawResults: [
            {
              meta: {
                index: 'index1',
                query: 'query1',
              },
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
              meta: {
                index: 'index2',
                query: 'query2',
              },
            },
          ],
          state: {
            index: 'index2',
            query: 'query2',
          },
        },
      ],
    });

    expect(vim.store.getState().results.index1.query).toBe('query1');
    expect(vim.store.getState().results.index1).toBeInstanceOf(SearchResults);
    expect(vim.store.getState().results.index2.query).toBe('query2');
    expect(vim.store.getState().results.index2).toBeInstanceOf(SearchResults);
  });
});

describe('widget manager', () => {
  it('triggers a search when a widget is added', async () => {
    const searchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'index',
      searchClient,
    });

    vim.widgetsManager.registerWidget({
      getSearchParameters: () => ({}),
      props: {},
      context: {},
    });

    expect(vim.store.getState().searching).toBe(false);

    await runOnlyNextMicroTask();

    expect(vim.store.getState().searching).toBe(true);

    await runAllMicroTasks();

    expect(vim.store.getState().searching).toBe(false);
  });
});

describe('transitionState', () => {
  it('executes widgets hook', () => {
    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    vim.widgetsManager.registerWidget({
      transitionState: (next, current) => {
        expect(next).toEqual({});

        return {
          ...current,
          a: 1,
        };
      },
    });

    vim.widgetsManager.registerWidget({
      transitionState: (next, current) => {
        expect(next).toEqual({});

        return {
          ...current,
          b: 2,
        };
      },
    });

    expect(vim.transitionState()).toEqual({
      a: 1,
      b: 2,
    });
  });
});

describe('getWidgetsIds', () => {
  it('returns the list of ids of all registered widgets', async () => {
    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    expect(vim.getWidgetsIds()).toEqual([]);

    vim.widgetsManager.registerWidget({ getMetadata: () => ({ id: 'a' }) });
    vim.widgetsManager.registerWidget({ getMetadata: () => ({ id: 'b' }) });
    vim.widgetsManager.registerWidget({ getMetadata: () => ({ id: 'c' }) });
    vim.widgetsManager.registerWidget({ getMetadata: () => ({ id: 'd' }) });

    await runAllMicroTasks();

    expect(vim.getWidgetsIds()).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('getSearchParameters', () => {
  it('expects a widget top level to be shared between main and derived parameters', () => {
    // <Vision indexName="index">
    //   <SearchBox defaultRefinement="shared" />
    //   <Index indexId="main" indexName="main" />
    // </Vision>

    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    // <SearchBox defaultRefinement="shared" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setQuery('shared');
      },
      context: {},
      props: {},
    });

    // <Index indexId="main" indexName="main" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setIndex('main');
      },
      props: {
        indexId: 'main',
      },
    });

    const { mainParameters, derivedParameters } = vim.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'index',
        query: 'shared',
      })
    );

    expect(derivedParameters).toEqual([
      {
        indexId: 'main',
        parameters: expect.objectContaining({
          index: 'main',
          query: 'shared',
        }),
      },
    ]);
  });

  it('expects a widget with the same id than the indexName to be a main parameters', () => {
    // <Vision indexName="index">
    //   <Index indexId="index" indexName="main" />
    // </Vision>

    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    // <Index indexId="index" indexName="main" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setIndex('main');
      },
      context: {},
      props: {
        indexId: 'index',
      },
    });

    const { mainParameters, derivedParameters } = vim.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'main',
      })
    );

    expect(derivedParameters).toEqual([]);
  });

  it('expects a widget with a different id than the indexName to be a derived parameters', () => {
    // <Vision indexName="index">
    //   <Index indexId="index_main" indexName="main" />
    // </Vision>

    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    // <Index indexId="index_main" indexName="main" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setIndex('main');
      },
      context: {},
      props: {
        indexId: 'index_main',
      },
    });

    const { mainParameters, derivedParameters } = vim.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'index',
      })
    );

    expect(derivedParameters).toEqual([
      {
        indexId: 'index_main',
        parameters: expect.objectContaining({
          index: 'main',
        }),
      },
    ]);
  });

  it('expects a widget within a mutli index context with the same id than the indexName to be a main parameters', () => {
    // <Vision indexName="index">
    //   <Index indexId="index" indexName="index" />
    //     <SearchBox defaultRefinement="main" />
    //   </Index>
    // </Vision>

    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    // <Index indexId="index" indexName="index" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setIndex('index');
      },
      context: {},
      props: {
        indexId: 'index',
      },
    });

    // <Index indexId="index" indexName="index" />
    //   <SearchBox defaultRefinement="main" />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setQuery('main');
      },
      context: {
        multiIndexContext: {
          targetedIndex: 'index',
        },
      },
      props: {},
    });

    const { mainParameters, derivedParameters } = vim.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'index',
        query: 'main',
      })
    );

    expect(derivedParameters).toEqual([]);
  });

  it('expects a widget within a mutli index context with a different id than the indexName to be a derived parameters', () => {
    // <Vision indexName="index">
    //   <Index indexId="index_with_refinement" indexName="index" />
    //     <SearchBox defaultRefinement="dervied" />
    //   </Index>
    // </Vision>

    const vim = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    // <Index indexId="index_with_refinement" indexName="index" />
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setIndex('index');
      },
      props: {
        indexId: 'index_with_refinement',
      },
    });

    // <Index indexId="index_with_refinement" indexName="index" />
    //   <SearchBox defaultRefinement="derived" />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters(state) {
        return state.setQuery('derived');
      },
      props: {
        indexContextValue: {
          targetedIndex: 'index_with_refinement',
        },
      },
    });

    const { mainParameters, derivedParameters } = vim.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'index',
      })
    );

    expect(derivedParameters).toEqual([
      {
        indexId: 'index_with_refinement',
        parameters: expect.objectContaining({
          index: 'index',
          query: 'derived',
        }),
      },
    ]);
  });

  it('expects widgets main parameters and derived parameters to be correctly calculated within a multi index context', () => {
    const wrapper = mount(
      <Vision indexName="index1" searchClient={createSearchClient()}>
        <Index indexName="bestbuy" />
        <Index indexName="instant_search" />

        <Index indexId="instant_search_apple" indexName="instant_search">
          <Configure filters="brand:Apple" />
        </Index>

        <Index indexId="instant_search_samsung" indexName="instant_search">
          <Configure filters="brand:Samsung" />
        </Index>

        <Index indexId="instant_search_microsoft" indexName="instant_search">
          <Configure filters="brand:Microsoft" />
        </Index>
      </Vision>
    );

    const {
      mainParameters,
      derivedParameters,
    } = wrapper.instance().state.visionManager.getSearchParameters();

    expect(mainParameters).toEqual(
      expect.objectContaining({
        index: 'index1',
      })
    );

    expect(derivedParameters).toEqual([
      expect.objectContaining({
        indexId: 'bestbuy',
        parameters: expect.objectContaining({
          index: 'bestbuy',
        }),
      }),
      expect.objectContaining({
        indexId: 'instant_search',
        parameters: expect.objectContaining({
          index: 'instant_search',
        }),
      }),
      expect.objectContaining({
        indexId: 'instant_search_apple',
        parameters: expect.objectContaining({
          index: 'instant_search',
          filters: 'brand:Apple',
        }),
      }),
      expect.objectContaining({
        indexId: 'instant_search_samsung',
        parameters: expect.objectContaining({
          index: 'instant_search',
          filters: 'brand:Samsung',
        }),
      }),
      expect.objectContaining({
        indexId: 'instant_search_microsoft',
        parameters: expect.objectContaining({
          index: 'instant_search',
          filters: 'brand:Microsoft',
        }),
      }),
    ]);
  });

  // it('expects widgets main parameters and derived parameters to be correctly calculated with SortBy within a multi index context', () => {
  //   const wrapper = mount(
  //     <Vision indexName="index1" searchClient={createSearchClient()}>
  //       <Index indexName="categories">
  //         <SortBy
  //           defaultRefinement="bestbuy"
  //           items={[
  //             { value: 'categories', label: 'Categories' },
  //             { value: 'bestbuy', label: 'Best buy' },
  //           ]}
  //         />
  //       </Index>

  //       <Index indexName="products">
  //         <SortBy
  //           defaultRefinement="brands"
  //           items={[
  //             { value: 'products', label: 'Products' },
  //             { value: 'brands', label: 'Brands' },
  //           ]}
  //         />
  //       </Index>
  //     </Vision>
  //   );

  //   const {
  //     mainParameters,
  //     derivedParameters,
  //   } = wrapper.instance().state.visionManager.getSearchParameters();

  //   expect(mainParameters).toEqual(
  //     expect.objectContaining({
  //       index: 'index1',
  //     })
  //   );

  //   expect(derivedParameters).toEqual([
  //     expect.objectContaining({
  //       indexId: 'categories',
  //       parameters: expect.objectContaining({
  //         index: 'bestbuy',
  //       }),
  //     }),
  //     expect.objectContaining({
  //       indexId: 'products',
  //       parameters: expect.objectContaining({
  //         index: 'brands',
  //       }),
  //     }),
  //   ]);
  // });
});

describe('searchStalled', () => {
  it('should be updated if search is stalled', async () => {
    const searchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'index',
      searchClient,
    });

    vim.widgetsManager.registerWidget({
      getMetadata: () => {},
      transitionState: () => {},
    });

    expect(searchClient.search).not.toHaveBeenCalled();
    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: true,
    });

    await runOnlyNextMicroTask();

    expect(searchClient.search).toHaveBeenCalledTimes(1);

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: true,
    });

    jest.runAllTimers();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: true,
    });

    await runOnlyNextMicroTask();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: false,
    });

    vim.widgetsManager.update();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: false,
    });

    await runOnlyNextMicroTask();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: false,
    });

    jest.runAllTimers();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: true,
    });

    await runOnlyNextMicroTask();

    expect(vim.store.getState()).toMatchObject({
      isSearchStalled: false,
    });
  });
});

describe('client.search', () => {
  it('should be called when there is a new widget', async () => {
    const searchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'index',
      searchClient,
    });

    vim.widgetsManager.registerWidget({
      getMetadata: () => {},
      transitionState: () => {},
    });

    expect(searchClient.search).toHaveBeenCalledTimes(0);

    await runAllMicroTasks();

    expect(searchClient.search).toHaveBeenCalledTimes(1);
  });

  it('should be called when there is a new client', () => {
    const searchClient = createSearchClient();
    const nextSearchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'index',
      searchClient,
    });

    expect(searchClient.search).toHaveBeenCalledTimes(0);
    expect(nextSearchClient.search).toHaveBeenCalledTimes(0);

    vim.updateClient(nextSearchClient);

    expect(searchClient.search).toHaveBeenCalledTimes(0);
    expect(nextSearchClient.search).toHaveBeenCalledTimes(1);
  });

  it('should not be called when the search is skipped', async () => {
    const searchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'index',
      searchClient,
    });

    vim.skipSearch();

    vim.widgetsManager.registerWidget({
      getMetadata: () => {},
      transitionState: () => {},
    });

    await runAllMicroTasks();

    expect(searchClient.search).toHaveBeenCalledTimes(0);
  });
});
