import { SearchParameters } from '@clinia/search-helper';
import connect from '../connectRefinementList';

jest.mock('../../core/createConnector', () => x => x);

let props;
let params;

describe('connectRefinementList', () => {
  describe('single index', () => {
    const contextValue = { mainTargetedIndex: 'index' };

    const results = {
      getFacetValues: jest.fn(() => []),
      getFacetByName: () => true,
      hits: [],
      meta: {},
    };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps(
        { property: 'ok', contextValue },
        {},
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: [],
        canRefine: false,
      });

      props = connect.getProvidedProps(
        { property: 'ok', contextValue },
        {},
        {}
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: [],
        canRefine: false,
      });

      props = connect.getProvidedProps(
        { property: 'ok', contextValue },
        { refinementList: { ok: ['wat'] } },
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: ['wat'],
        canRefine: false,
      });

      props = connect.getProvidedProps(
        { property: 'ok', defaultRefinement: ['wat'], contextValue },
        {},
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: ['wat'],
        canRefine: false,
      });

      props = connect.getProvidedProps(
        { property: 'ok', searchable: true, contextValue },
        {},
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: [],
        canRefine: false,
      });

      results.getFacetValues.mockClear();
      results.getFacetValues.mockImplementation(() => [
        {
          name: 'wat',
          isRefined: true,
          count: 20,
        },
        {
          name: 'oy',
          isRefined: false,
          count: 10,
        },
      ]);
      props = connect.getProvidedProps(
        { property: 'ok', contextValue },
        {},
        { results }
      );
      expect(props.items).toEqual([
        {
          value: ['wat'],
          label: 'wat',
          isRefined: true,
          count: 20,
        },
        {
          value: ['oy'],
          label: 'oy',
          isRefined: false,
          count: 10,
        },
      ]);

      props = connect.getProvidedProps(
        { property: 'ok', limit: 1, contextValue },
        {},
        { results }
      );
      expect(props.items).toEqual([
        {
          value: ['wat'],
          label: 'wat',
          isRefined: true,
          count: 20,
        },
      ]);

      const transformItems = jest.fn(() => ['items']);
      props = connect.getProvidedProps(
        { property: 'ok', transformItems, contextValue },
        {},
        { results }
      );
      expect(transformItems.mock.calls[0][0]).toEqual([
        {
          value: ['wat'],
          label: 'wat',
          isRefined: true,
          count: 20,
        },
        {
          value: ['oy'],
          label: 'oy',
          isRefined: false,
          count: 10,
        },
      ]);
      expect(props.items).toEqual(['items']);
    });

    it("calling refine updates the widget's search state", () => {
      const nextState = connect.refine(
        { property: 'ok', contextValue },
        { otherKey: 'val', refinementList: { otherKey: ['val'] } },
        ['yep']
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        page: 1,
        refinementList: { ok: ['yep'], otherKey: ['val'] },
      });
    });

    it("increases maxValuesPerFacet when it isn't big enough", () => {
      const initSP = new SearchParameters({ maxValuesPerFacet: 100 });

      params = connect.getSearchParameters(
        initSP,
        {
          limit: 101,
          contextValue,
        },
        {}
      );
      expect(params.maxValuesPerFacet).toBe(101);

      params = connect.getSearchParameters(
        initSP,
        {
          showMore: true,
          showMoreLimit: 101,
          contextValue,
        },
        {}
      );
      expect(params.maxValuesPerFacet).toBe(101);

      params = connect.getSearchParameters(
        initSP,
        {
          limit: 99,
          contextValue,
        },
        {}
      );
      expect(params.maxValuesPerFacet).toBe(100);

      params = connect.getSearchParameters(
        initSP,
        {
          showMore: true,
          showMoreLimit: 99,
          contextValue,
        },
        {}
      );
      expect(params.maxValuesPerFacet).toBe(100);
    });

    it('correctly applies its state to search parameters', () => {
      const initSP = new SearchParameters();

      params = connect.getSearchParameters(
        initSP,
        {
          property: 'ok',
          operator: 'or',
          limit: 1,
          contextValue,
        },
        { refinementList: { ok: ['wat'] } }
      );
      expect(params).toEqual(
        initSP
          .addDisjunctiveFacet('ok')
          .addDisjunctiveFacetRefinement('ok', 'wat')
          .setQueryParameter('maxValuesPerFacet', 1)
      );

      params = connect.getSearchParameters(
        initSP,
        {
          property: 'ok',
          operator: 'and',
          limit: 1,
          contextValue,
        },
        { refinementList: { ok: ['wat'] } }
      );
      expect(params).toEqual(
        initSP
          .addFacet('ok')
          .addFacetRefinement('ok', 'wat')
          .setQueryParameter('maxValuesPerFacet', 1)
      );
    });

    it('registers its id in metadata', () => {
      const metadata = connect.getMetadata(
        { property: 'ok', contextValue },
        {}
      );
      expect(metadata).toEqual({ id: 'ok', index: 'index', items: [] });
    });

    it('registers its filter in metadata', () => {
      const metadata = connect.getMetadata(
        { property: 'wot', contextValue },
        { refinementList: { wot: ['wat', 'wut'] } }
      );
      expect(metadata).toEqual({
        id: 'wot',
        index: 'index',
        items: [
          {
            label: 'wot: ',
            property: 'wot',
            currentRefinement: ['wat', 'wut'],
            value: metadata.items[0].value,
            items: [
              {
                label: 'wat',
                value: metadata.items[0].items[0].value,
              },
              {
                label: 'wut',
                value: metadata.items[0].items[1].value,
              },
            ],
            // Ignore value, we test it later
          },
        ],
      });
    });

    it('items value function should clear it from the search state', () => {
      const metadata = connect.getMetadata(
        { property: 'one', contextValue },
        { refinementList: { one: ['one1', 'one2'], two: ['two'] } }
      );

      let searchState = metadata.items[0].items[0].value({
        refinementList: { one: ['one1', 'one2'], two: ['two'] },
      });

      expect(searchState).toEqual({
        page: 1,
        refinementList: { one: ['one2'], two: ['two'] },
      });

      searchState = metadata.items[0].items[1].value(searchState);

      expect(searchState).toEqual({
        page: 1,
        refinementList: { one: '', two: ['two'] },
      });
    });

    it('should return the right searchState when clean up', () => {
      let searchState = connect.cleanUp(
        { property: 'name', contextValue },
        {
          refinementList: { name: 'searchState', name2: 'searchState' },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({
        refinementList: { name2: 'searchState' },
        another: { searchState: 'searchState' },
      });

      searchState = connect.cleanUp(
        { property: 'name2', contextValue },
        searchState
      );
      expect(searchState).toEqual({
        refinementList: {},
        another: { searchState: 'searchState' },
      });
    });

    it('computes canRefine based on the length of the transformed items list', () => {
      const transformItems = () => [];

      props = connect.getProvidedProps(
        { property: 'ok', transformItems, contextValue },
        {},
        { results }
      );

      expect(props.canRefine).toEqual(false);
    });
  });

  describe('multi index', () => {
    const contextValue = { mainTargetedIndex: 'first' };
    const indexContextValue = { targetedIndex: 'second' };

    const results = {
      first: {
        getFacetValues: jest.fn(() => []),
        getFacetByName: () => true,
        meta: {},
      },
      second: {
        getFacetValues: jest.fn(() => []),
        getFacetByName: () => true,
        meta: {},
      },
    };

    it('provides the correct props to the component', () => {
      props = connect.getProvidedProps(
        { property: 'ok', contextValue, indexContextValue },
        {},
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: [],
        canRefine: false,
      });

      props = connect.getProvidedProps(
        { property: 'ok', contextValue, indexContextValue },
        { indices: { second: { refinementList: { ok: ['wat'] } } } },
        { results }
      );
      expect(props).toEqual({
        items: [],
        currentRefinement: ['wat'],
        canRefine: false,
      });

      results.second.getFacetValues.mockClear();
      results.second.getFacetValues.mockImplementation(() => [
        {
          name: 'wat',
          isRefined: true,
          count: 20,
        },
        {
          name: 'oy',
          isRefined: false,
          count: 10,
        },
      ]);
    });

    it("calling refine updates the widget's search state", () => {
      let nextState = connect.refine(
        { property: 'ok', contextValue, indexContextValue },
        {
          otherKey: 'val',
          indices: { second: { refinementList: { otherKey: ['val'] } } },
        },
        ['yep']
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        indices: {
          second: {
            page: 1,
            refinementList: { ok: ['yep'], otherKey: ['val'] },
          },
        },
      });

      nextState = connect.refine(
        {
          property: 'ok',
          contextValue,
          indexContextValue,
        },
        {
          otherKey: 'val',
          indices: { second: { refinementList: { otherKey: ['val'] } } },
        },
        ['yep']
      );
      expect(nextState).toEqual({
        otherKey: 'val',
        indices: {
          second: {
            page: 1,
            refinementList: { ok: ['yep'], otherKey: ['val'] },
          },
        },
      });
    });

    it('correctly applies its state to search parameters', () => {
      const initSP = new SearchParameters();

      params = connect.getSearchParameters(
        initSP,
        {
          property: 'ok',
          operator: 'or',
          limit: 1,
          contextValue,
          indexContextValue,
        },
        { indices: { second: { refinementList: { ok: ['wat'] } } } }
      );
      expect(params).toEqual(
        initSP
          .addDisjunctiveFacet('ok')
          .addDisjunctiveFacetRefinement('ok', 'wat')
          .setQueryParameter('maxValuesPerFacet', 1)
      );

      params = connect.getSearchParameters(
        initSP,
        {
          property: 'ok',
          operator: 'and',
          limit: 1,
          contextValue,
          indexContextValue,
        },
        { indices: { second: { refinementList: { ok: ['wat'] } } } }
      );
      expect(params).toEqual(
        initSP
          .addFacet('ok')
          .addFacetRefinement('ok', 'wat')
          .setQueryParameter('maxValuesPerFacet', 1)
      );
    });

    it('registers its filter in metadata', () => {
      const metadata = connect.getMetadata(
        { property: 'wot', contextValue, indexContextValue },
        { indices: { second: { refinementList: { wot: ['wat', 'wut'] } } } }
      );
      expect(metadata).toEqual({
        id: 'wot',
        index: 'second',
        items: [
          {
            label: 'wot: ',
            property: 'wot',
            currentRefinement: ['wat', 'wut'],
            value: metadata.items[0].value,
            items: [
              {
                label: 'wat',
                value: metadata.items[0].items[0].value,
              },
              {
                label: 'wut',
                value: metadata.items[0].items[1].value,
              },
            ],
            // Ignore value, we test it later
          },
        ],
      });
    });

    it('items value function should clear it from the search state', () => {
      const metadata = connect.getMetadata(
        { property: 'one', contextValue, indexContextValue },
        {
          indices: {
            second: { refinementList: { one: ['one1', 'one2'], two: ['two'] } },
          },
        }
      );

      let searchState = metadata.items[0].items[0].value({
        indices: {
          second: { refinementList: { one: ['one1', 'one2'], two: ['two'] } },
        },
      });

      expect(searchState).toEqual({
        indices: {
          second: { page: 1, refinementList: { one: ['one2'], two: ['two'] } },
        },
      });

      searchState = metadata.items[0].items[1].value(searchState);

      expect(searchState).toEqual({
        indices: {
          second: { page: 1, refinementList: { one: '', two: ['two'] } },
        },
      });
    });

    it('should return the right searchState when clean up', () => {
      let searchState = connect.cleanUp(
        { property: 'name', contextValue, indexContextValue },
        {
          indices: {
            second: {
              refinementList: { name: 'searchState', name2: 'searchState' },
            },
          },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({
        indices: { second: { refinementList: { name2: 'searchState' } } },
        another: { searchState: 'searchState' },
      });

      searchState = connect.cleanUp(
        { property: 'name2', contextValue, indexContextValue },
        searchState
      );
      expect(searchState).toEqual({
        indices: { second: { refinementList: {} } },
        another: { searchState: 'searchState' },
      });
    });
  });
});
