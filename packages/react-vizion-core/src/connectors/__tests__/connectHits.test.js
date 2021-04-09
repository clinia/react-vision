import connect from '../connectHits';

jest.mock('../../core/createConnector', () => x => x);

const { getSearchParameters } = connect;

describe('connectHits', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    it('provides the current hits to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: { hits, meta: { perPage: 2, page: 2 } },
      });

      expect(props).toEqual({
        hits: hits.map(hit => expect.objectContaining(hit)),
      });
    });

    it('adds positions to the hits provided to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: { hits, perPage: 2, page: 2 },
      });
      expect(props).toEqual({
        hits: [{ __position: 5 }],
      });
    });

    it('adds queryId to the hits provided to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: { hits, perPage: 2, page: 2, queryId: 'theQueryId' },
      });
      expect(props).toEqual({
        hits: [expect.objectContaining({ __queryId: 'theQueryId' })],
      });
    });

    it("doesn't render when no hits are available", () => {
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: null,
      });
      expect(props).toEqual({ hits: [] });
    });

    it('should return the searchParameters unchanged', () => {
      const searchParameters = getSearchParameters({ perPage: 10 });
      expect(searchParameters).toEqual({ perPage: 10 });
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    it('provides the current hits to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { hits, meta: { perPage: 2, page: 2 } },
          },
        }
      );
      expect(props).toEqual({
        hits: hits.map(hit => expect.objectContaining(hit)),
      });
    });

    it('adds positions to the hits provided to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { hits, perPage: 2, page: 2 },
          },
        }
      );
      expect(props).toEqual({
        hits: [{ __position: 5 }],
      });
    });

    it('adds queryId to the hits provided to the component', () => {
      const hits = [{}];
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { hits, perPage: 2, page: 2, queryId: 'theQueryId' },
          },
        }
      );
      expect(props).toEqual({
        hits: [expect.objectContaining({ __queryId: 'theQueryId' })],
      });
    });

    it("doesn't render when no hits are available", () => {
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        { results: { second: null } }
      );
      expect(props).toEqual({ hits: [] });
    });

    it('should return the searchParameters unchanged', () => {
      const searchParameters = getSearchParameters({ perPage: 10 });
      expect(searchParameters).toEqual({ perPage: 10 });
    });
  });
});
