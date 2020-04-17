import createVisionManager from '../createVisionManager';

const runAllMicroTasks = () => new Promise(setImmediate);

const createSearchClient = () => ({
  search: jest.fn(() =>
    Promise.resolve({
      results: [
        {
          meta: {},
          hits: [{ value: 'results' }],
        },
      ],
    })
  ),
});

describe('createVisionManager with results', () => {
  describe('on search', () => {
    it('updates the store on widget lifecycle', async () => {
      const searchClient = createSearchClient();

      const vim = createVisionManager({
        indexName: 'index',
        searchClient,
      });

      vim.widgetsManager.registerWidget({
        getSearchParameters: params => params.setQuery('search'),
        props: {},
        context: {},
      });

      expect(vim.store.getState().results).toBe(null);

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(vim.store.getState().results.hits).toEqual([{ value: 'results' }]);
      expect(vim.store.getState().error).toBe(null);

      vim.widgetsManager.update();

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
      expect(vim.store.getState().results.hits).toEqual([{ value: 'results' }]);
      expect(vim.store.getState().error).toBe(null);
    });

    it('updates the store on external updates', async () => {
      const searchClient = createSearchClient();

      const vim = createVisionManager({
        indexName: 'index',
        searchClient,
      });

      vim.onExternalStateUpdate({});

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(1);
      expect(vim.store.getState().results.hits).toEqual([{ value: 'results' }]);
      expect(vim.store.getState().error).toBe(null);

      vim.onExternalStateUpdate({});

      await runAllMicroTasks();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
      expect(vim.store.getState().results.hits).toEqual([{ value: 'results' }]);
      expect(vim.store.getState().error).toBe(null);
    });
  });
});
