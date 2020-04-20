import connect from '../connectStats';

jest.mock('../../core/createConnector', () => x => x);

let props;
describe('connectStats', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps({ contextValue }, null, {});
      expect(props).toBe(null);

      props = connect.getProvidedProps({ contextValue }, null, {
        results: { total: 666, took: 1, hits: [] },
      });
      expect(props).toEqual({ total: 666, took: 1 });
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {}
      );
      expect(props).toBe(null);

      props = connect.getProvidedProps(
        { contextValue, indexContextValue },
        null,
        {
          results: { second: { total: 666, took: 1 } },
        }
      );
      expect(props).toEqual({ total: 666, took: 1 });
    });
  });
});
