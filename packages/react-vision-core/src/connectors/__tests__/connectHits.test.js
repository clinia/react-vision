import connect from '../connectHits';

jest.mock('../../core/createConnector', () => x => x);

const { getSearchParameters } = connect;

describe('connectHits', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    it('provides the current records to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: { records, meta: { perPage: 2, page: 2 } },
      });

      expect(props).toEqual({
        records: records.map(record => expect.objectContaining(record)),
      });
    });

    it('adds positions to the records provided to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: { records, perPage: 2, page: 2 },
      });
      expect(props).toEqual({
        records: [{ __position: 5 }],
      });
    });

    it("doesn't render when no records are available", () => {
      const props = connect.getProvidedProps({ contextValue }, null, {
        results: null,
      });
      expect(props).toEqual({ records: [] });
    });

    it('should return the searchParameters unchanged', () => {
      const searchParameters = getSearchParameters({ perPage: 10 });
      expect(searchParameters).toEqual({ perPage: 10 });
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    it('provides the current records to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, meta: { perPage: 2, page: 2 } },
          },
        }
      );
      expect(props).toEqual({
        records: records.map(record => expect.objectContaining(record)),
      });
    });

    it('adds positions to the records provided to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, perPage: 2, page: 2 },
          },
        }
      );
      expect(props).toEqual({
        records: [{ __position: 5 }],
      });
    });

    it("doesn't render when no records are available", () => {
      const props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        { results: { second: null } }
      );
      expect(props).toEqual({ records: [] });
    });

    it('should return the searchParameters unchanged', () => {
      const searchParameters = getSearchParameters({ perPage: 10 });
      expect(searchParameters).toEqual({ perPage: 10 });
    });
  });
});
