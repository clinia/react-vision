import createVizionManager from '../createVizionManager';

const runAllMicroTasks = () => new Promise(setImmediate);

const createSearchClient = () => ({
  search: jest.fn(),
});

describe('createVizionManager with errors', () => {
  describe('on search', () => {
    it('updates the store on widget lifecycle', async () => {
      const searchClient = createSearchClient();

      searchClient.search.mockImplementation(() =>
        Promise.reject(new Error('API_ERROR_1'))
      );

      const vim = createVizionManager({
        indexName: 'index',
        searchClient,
      });

      vim.widgetsManager.registerWidget({
        getSearchParameters: params => params.setQuery('search'),
        context: {},
        props: {},
      });

      expect(vim.store.getState().error).toBe(null);

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(vim.store.getState().error).toEqual(new Error('API_ERROR_1'));
      expect(vim.store.getState().results).toEqual(null);

      searchClient.search.mockImplementation(() =>
        Promise.reject(new Error('API_ERROR_2'))
      );

      vim.widgetsManager.update();

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
      expect(vim.store.getState().error).toEqual(new Error('API_ERROR_2'));
      expect(vim.store.getState().results).toEqual(null);
    });

    it('updates the store on external updates', async () => {
      const searchClient = createSearchClient();

      searchClient.search.mockImplementation(() =>
        Promise.reject(new Error('API_ERROR_1'))
      );

      const vim = createVizionManager({
        indexName: 'index',
        searchClient,
      });

      vim.onExternalStateUpdate({});

      expect(vim.store.getState().error).toBe(null);

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(vim.store.getState().error).toEqual(new Error('API_ERROR_1'));
      expect(vim.store.getState().results).toEqual(null);

      searchClient.search.mockImplementation(() =>
        Promise.reject(new Error('API_ERROR_2'))
      );

      vim.onExternalStateUpdate({});

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
      expect(vim.store.getState().error).toEqual(new Error('API_ERROR_2'));
      expect(vim.store.getState().results).toEqual(null);
    });

    it('reset the error after a successful search', async () => {
      const searchClient = createSearchClient();

      searchClient.search.mockImplementation(() =>
        Promise.reject(new Error('API_ERROR'))
      );

      const vim = createVizionManager({
        indexName: 'index',
        searchClient,
      });

      vim.widgetsManager.registerWidget({
        getSearchParameters: params => params.setQuery('search'),
        context: {},
        props: {},
      });

      expect(vim.store.getState().error).toBe(null);

      await runAllMicroTasks();

      expect(vim.store.getState().error).toEqual(new Error('API_ERROR'));
      expect(vim.store.getState().results).toEqual(null);

      searchClient.search.mockImplementation(() =>
        Promise.resolve({
          results: [
            {
              meta: {},
              hits: [],
            },
          ],
        })
      );

      vim.widgetsManager.update();

      await runAllMicroTasks();

      expect(vim.store.getState().error).toEqual(null);
      expect(vim.store.getState().results).toEqual(
        expect.objectContaining({
          hits: [],
        })
      );
    });
  });
});
