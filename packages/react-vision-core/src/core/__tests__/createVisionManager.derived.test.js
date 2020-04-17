import createVisionManager from '../createVisionManager';

const runAllMicroTasks = () => new Promise(setImmediate);

const createSearchClient = () => ({
  search: jest.fn(requests =>
    Promise.resolve({
      results: requests.map(
        ({ indexName, params: { page, query, perPage } }) => ({
          meta: {
            index: indexName,
            query,
            page,
            perPage,
          },
          hits: [],
        })
      ),
    })
  ),
});

describe('createVisionManager with multi index', () => {
  it('updates the store and searches', async () => {
    // <Vision indexName="first">
    //   <SearchBox defaultRefinement="first query 1" />
    //
    //   <Index indexName="first" indexId="first">
    //     <Pagination defaultRefinement={3} />
    //   </Index>
    //
    //   <Index indexName="second" indexId="second">
    //     <SearchBox defaultRefinement="second query 1" />
    //   </Index>
    // </Vision>

    const vim = createVisionManager({
      indexName: 'first',
      initialState: {},
      searchParameters: {},
      searchClient: createSearchClient(),
    });

    // <SearchBox defaultRefinement="first query 1" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('first query 1'),
      props: {},
    });

    // <Index indexName="first" indexId="first" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first',
      },
    });

    // <Index indexName="first" indexId="first">
    //   <Pagination defaultRefinement={3} />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setPage(3),
      props: {
        indexContextValue: {
          targetedIndex: 'first',
        },
      },
    });

    // <Index indexName="second" indexId="second" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('second'),
      props: {
        indexName: 'second',
        indexId: 'second',
      },
    });

    // <Index indexName="second" indexId="second">
    //   <SearchBox defaultRefinement="second query 1" />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('second query 1'),
      props: {
        indexContextValue: {
          targetedIndex: 'second',
        },
      },
    });

    expect(vim.store.getState().results).toBe(null);

    await runAllMicroTasks();

    expect(vim.store.getState().results.first).toEqual(
      expect.objectContaining({
        query: 'first query 1',
        index: 'first',
        page: 3,
      })
    );

    expect(vim.store.getState().results.second).toEqual(
      expect.objectContaining({
        query: 'second query 1',
        index: 'second',
      })
    );

    await runAllMicroTasks();

    // <SearchBox defaultRefinement="first query 2" />
    vim.widgetsManager.getWidgets()[0].getSearchParameters = params =>
      params.setQuery('first query 2');

    // <Index indexName="second" indexId="second">
    //   <SearchBox defaultRefinement="second query 2" />
    // </Index>
    vim.widgetsManager.getWidgets()[4].getSearchParameters = params =>
      params.setQuery('second query 2');

    vim.widgetsManager.update();

    await runAllMicroTasks();

    expect(vim.store.getState().results.first).toEqual(
      expect.objectContaining({
        query: 'first query 2',
        index: 'first',
        page: 3,
      })
    );

    expect(vim.store.getState().results.second).toEqual(
      expect.objectContaining({
        query: 'second query 2',
        index: 'second',
      })
    );
  });

  it('searches with duplicate Index & SortBy', async () => {
    // <Vision indexName="first">
    //   <SearchBox defaultRefinement="query" />
    //
    //   <Index indexName="first" indexId="first">
    //     <SortBy defaultRefinement="third" />
    //   </Index>
    //
    //   <Index indexName="second" indexId="second" />
    // </Vision>;

    const vim = createVisionManager({
      indexName: 'first',
      initialState: {},
      searchParameters: {},
      searchClient: createSearchClient(),
    });

    // <SearchBox defaultRefinement="query" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('query'),
      props: {},
    });

    // <Index indexName="first" indexId="first" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first',
      },
    });

    // <Index indexName="first" indexId="first">
    //   <SortBy defaultRefinement="third" />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('third'),
      props: {
        indexContextValue: {
          targetedIndex: 'first',
        },
      },
    });

    // <Index indexName="second" indexId="second" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('second'),
      props: {
        indexName: 'second',
        indexId: 'second',
      },
    });

    expect(vim.store.getState().results).toBe(null);

    await runAllMicroTasks();

    expect(vim.store.getState().results.first).toEqual(
      expect.objectContaining({
        index: 'third',
        query: 'query',
      })
    );

    expect(vim.store.getState().results.second).toEqual(
      expect.objectContaining({
        index: 'second',
        query: 'query',
      })
    );
  });

  it('searches with N queries for N Index widgets', async () => {
    // <Vision indexName="first">
    //   <Index indexName="first" />
    //   <Index indexName="second" />
    //   <Index indexName="third" />
    //   <Index indexName="four" />
    // </Vision>;

    const searchClient = createSearchClient();

    const vim = createVisionManager({
      indexName: 'first',
      initialState: {},
      searchParameters: {},
      searchClient,
    });

    // <Index indexName="first" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first',
      },
    });

    // <Index indexName="second" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('second'),
      props: {
        indexName: 'second',
        indexId: 'second',
      },
    });

    // <Index indexName="third" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('third'),
      props: {
        indexName: 'third',
        indexId: 'third',
      },
    });

    // <Index indexName="four" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: x => x.setIndex('four'),
      props: {
        indexName: 'four',
        indexId: 'four',
      },
    });

    await runAllMicroTasks();

    expect(searchClient.search.mock.calls[0][0]).toHaveLength(4);

    vim.widgetsManager.update();

    await runAllMicroTasks();

    expect(searchClient.search.mock.calls[1][0]).toHaveLength(4);
  });

  it('searches with same index but different params', async () => {
    // <Vision indexName="first">
    //   <SearchBox defaultRefinement="first query" />
    //
    //   <Index indexName="first" indexId="first_5_hits">
    //     <Configure perPage={5} />
    //   </Index>
    //
    //   <Index indexName="first" indexId="first_10_hits">
    //     <Configure perPage={10} />
    //   </Index>
    // </Vision>

    const vim = createVisionManager({
      indexName: 'first',
      initialState: {},
      searchParameters: {},
      searchClient: createSearchClient(),
    });

    // <SearchBox defaultRefinement="first query" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('first query'),
      context: {},
      props: {},
    });

    // <Index indexName="first" indexId="first_5_hits" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first_5_hits',
      },
    });

    // <Index indexName="first" indexId="first_5_hits">
    //   <Configure perPage={5} />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQueryParameter('perPage', 5),
      props: {
        indexContextValue: {
          targetedIndex: 'first_5_hits',
        },
      },
    });

    // <Index indexName="first" indexId="first_10_hits" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first_10_hits',
      },
    });

    // <Index indexName="first" indexId="first_10_hits">
    //   <Configure perPage={10} />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQueryParameter('perPage', 10),
      props: {
        indexContextValue: {
          targetedIndex: 'first_10_hits',
        },
      },
    });

    expect(vim.store.getState().results).toBe(null);

    await runAllMicroTasks();

    expect(vim.store.getState().results.first_5_hits).toEqual(
      expect.objectContaining({
        query: 'first query',
        index: 'first',
        perPage: 5,
      })
    );

    expect(vim.store.getState().results.first_10_hits).toEqual(
      expect.objectContaining({
        query: 'first query',
        index: 'first',
        perPage: 10,
      })
    );
  });

  it('switching from mono to multi index', async () => {
    // <Vision indexName="first">
    //   <SearchBox defaultRefinement="first query 1" />
    //
    //   <Index indexName="first" indexId="first">
    //     <Pagination defaultRefinement={3} />
    //   </Index>
    //
    //   <Index indexName="second" indexId="second">
    //     <SearchBox defaultRefinement="second query 1" />
    //   </Index>
    // </Vision>

    const vim = createVisionManager({
      indexName: 'first',
      initialState: {},
      searchParameters: {},
      searchClient: createSearchClient(),
    });

    // <SearchBox defaultRefinement="first query 1" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('first query 1'),
      props: {},
    });

    // <Index indexName="first" indexId="first" />
    const unregisterFirstIndexWidget = vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first',
      },
    });

    // <Index indexName="first" indexId="first">
    //   <Pagination defaultRefinement={3} />
    // </Index>
    const unregisterPaginationWidget = vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setPage(3),
      props: {
        indexContextValue: {
          targetedIndex: 'first',
        },
      },
    });

    // <Index indexName="second" indexId="second" />
    const unregisterSecondIndexWidget = vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('second'),
      props: {
        indexName: 'second',
        indexId: 'second',
      },
    });

    // <Index indexName="second" indexId="second">
    //   <SearchBox defaultRefinement="second query 1" />
    // </Index>
    const unregisterSecondSearchBoxWidget = vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('second query 1'),
      props: {
        indexContextValue: {
          targetedIndex: 'second',
        },
      },
    });

    expect(vim.store.getState().results).toBe(null);

    await runAllMicroTasks();

    expect(vim.store.getState().results.first).toEqual(
      expect.objectContaining({
        index: 'first',
        query: 'first query 1',
        page: 3,
      })
    );

    expect(vim.store.getState().results.second).toEqual(
      expect.objectContaining({
        index: 'second',
        query: 'second query 1',
      })
    );

    vim.widgetsManager.getWidgets()[0].getSearchParameters = params =>
      params.setQuery('first query 2');

    unregisterFirstIndexWidget();
    unregisterPaginationWidget();
    unregisterSecondIndexWidget();
    unregisterSecondSearchBoxWidget();

    await runAllMicroTasks();

    expect(vim.store.getState().results).toEqual(
      expect.objectContaining({
        index: 'first',
        query: 'first query 2',
      })
    );

    // <Index indexName="first" indexId="first" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('first'),
      props: {
        indexName: 'first',
        indexId: 'first',
      },
    });

    // <Index indexName="first" indexId="first">
    //   <Pagination defaultRefinement={3} />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setPage(3),
      props: {
        indexContextValue: {
          targetedIndex: 'first',
        },
      },
    });

    // <Index indexName="second" indexId="second" />
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setIndex('second'),
      props: {
        indexName: 'second',
        indexId: 'second',
      },
    });

    // <Index indexName="second" indexId="second">
    //   <SearchBox defaultRefinement="second query 1" />
    // </Index>
    vim.widgetsManager.registerWidget({
      getSearchParameters: params => params.setQuery('second query 2'),
      props: {
        indexContextValue: {
          targetedIndex: 'second',
        },
      },
    });

    await runAllMicroTasks();

    expect(vim.store.getState().results.first).toEqual(
      expect.objectContaining({
        index: 'first',
        query: 'first query 2',
        page: 3,
      })
    );

    expect(vim.store.getState().results.second).toEqual(
      expect.objectContaining({
        index: 'second',
        query: 'second query 2',
      })
    );
  });
});
