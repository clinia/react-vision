import { SearchParameters } from '@clinia/search-helper';
import connect from '../connectPerPage';

jest.mock('../../core/createConnector', () => x => x);

let props;
let params;

describe('connectPerPage', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    const items = [{ label: '10', value: 10 }, { label: '20', value: 20 }];

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps(
        { items, contextValue },
        { perPage: '10' }
      );
      expect(props).toEqual({
        currentRefinement: 10,
        items: [
          { label: '10', value: 10, isRefined: true },
          {
            label: '20',
            value: 20,
            isRefined: false,
          },
        ],
      });

      props = connect.getProvidedProps(
        { defaultRefinement: 20, items, contextValue },
        {}
      );
      expect(props).toEqual({
        currentRefinement: 20,
        items: [
          {
            label: '10',
            value: 10,
            isRefined: false,
          },
          { label: '20', value: 20, isRefined: true },
        ],
      });

      const transformItems = jest.fn(() => ['items']);
      props = connect.getProvidedProps(
        { items, transformItems, contextValue },
        { perPage: '10' }
      );
      expect(transformItems.mock.calls[0][0]).toEqual([
        { label: '10', value: 10, isRefined: true },
        { label: '20', value: 20, isRefined: false },
      ]);
      expect(props.items).toEqual(['items']);
    });

    it("calling refine updates the widget's search state", () => {
      const nextState = connect.refine(
        { contextValue },
        { otherKey: 'val' },
        30
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        page: 1,
        perPage: 30,
      });
    });

    it('refines the perPage parameter', () => {
      const sp = new SearchParameters();

      params = connect.getSearchParameters(
        sp,
        { contextValue },
        { perPage: 10 }
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 10));

      params = connect.getSearchParameters(
        sp,
        { contextValue },
        { perPage: '10' }
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 10));

      params = connect.getSearchParameters(
        sp,
        { defaultRefinement: 20, contextValue },
        {}
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 20));
    });

    it('registers its id in metadata', () => {
      const metadata = connect.getMetadata({ contextValue });
      expect(metadata).toEqual({ id: 'perPage' });
    });

    it('should return the right searchState when clean up', () => {
      const searchState = connect.cleanUp(
        { contextValue },
        {
          perPage: 'searchState',
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({ another: { searchState: 'searchState' } });
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    const items = [{ label: '10', value: 10 }, { label: '20', value: 20 }];

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps(
        { items, contextValue, indexContextValue },
        { indices: { second: { perPage: '10' } } }
      );
      expect(props).toEqual({
        currentRefinement: 10,
        items: [
          { label: '10', value: 10, isRefined: true },
          {
            label: '20',
            value: 20,
            isRefined: false,
          },
        ],
      });

      props = connect.getProvidedProps(
        { defaultRefinement: 20, items, contextValue, indexContextValue },
        {}
      );
      expect(props).toEqual({
        currentRefinement: 20,
        items: [
          {
            label: '10',
            value: 10,
            isRefined: false,
          },
          { label: '20', value: 20, isRefined: true },
        ],
      });

      const transformItems = jest.fn(() => ['items']);
      props = connect.getProvidedProps(
        { items, transformItems, contextValue, indexContextValue },
        { indices: { second: { perPage: '10' } } }
      );
      expect(transformItems.mock.calls[0][0]).toEqual([
        { label: '10', value: 10, isRefined: true },
        { label: '20', value: 20, isRefined: false },
      ]);
      expect(props.items).toEqual(['items']);
    });

    it("calling refine updates the widget's search state", () => {
      let nextState = connect.refine(
        { contextValue, indexContextValue },
        { indices: { second: { otherKey: 'val' } } },
        30
      );
      expect(nextState).toEqual({
        indices: {
          second: { page: 1, otherKey: 'val', perPage: 30 },
        },
      });

      nextState = connect.refine(
        {
          contextValue: { mainTargetedIndex: 'second' },
          indexContextValue: { targetedIndex: 'second' },
        },
        { indices: { second: { otherKey: 'val', perPage: 30 } } },
        30
      );
      expect(nextState).toEqual({
        indices: {
          second: { otherKey: 'val', perPage: 30, page: 1 },
        },
      });
    });

    it('correctly applies its state to search parameters', () => {
      const sp = new SearchParameters();

      params = connect.getSearchParameters(
        sp,
        { contextValue, indexContextValue },
        { indices: { second: { perPage: '10' } } }
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 10));

      params = connect.getSearchParameters(
        sp,
        { contextValue, indexContextValue },
        { indices: { second: { perPage: '10' } } }
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 10));

      params = connect.getSearchParameters(
        sp,
        { defaultRefinement: 20, contextValue, indexContextValue },
        {}
      );
      expect(params).toEqual(sp.setQueryParameter('perPage', 20));
    });

    it('registers its id in metadata', () => {
      const metadata = connect.getMetadata({});
      expect(metadata).toEqual({ id: 'perPage' });
    });

    it('should return the right searchState when clean up', () => {
      const searchState = connect.cleanUp(
        { contextValue, indexContextValue },
        {
          indices: {
            second: {
              perPage: 'searchState',
              another: { searchState: 'searchState' },
            },
          },
        }
      );
      expect(searchState).toEqual({
        indices: { second: { another: { searchState: 'searchState' } } },
      });
    });
  });
});
