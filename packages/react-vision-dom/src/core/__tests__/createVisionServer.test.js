import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchParameters } from '@clinia/search-helper';
import {
  Vision,
  Index,
  createConnector,
  version,
} from '@clinia/react-vision-core';
import { findResultsState } from '../createVisionServer';

Enzyme.configure({ adapter: new Adapter() });

describe('findResultsState', () => {
  const createSearchClient = () => ({
    search: requests =>
      Promise.resolve({
        results: requests.map(({ indexName, params: { query } }) => ({
          meta: {
            query,
          },
          index: indexName,
        })),
      }),
    initPlaces: jest.fn(),
  });

  const createWidget = ({ getSearchParameters = () => {} } = {}) =>
    createConnector({
      displayName: 'CoolConnector',
      getProvidedProps: () => null,
      getSearchParameters(searchParameters, props, searchState) {
        getSearchParameters();

        const fallback = props.defaultRefinement || 'Apple';

        if (this.props.indexContextValue) {
          const index = this.props.indexContextValue.targetedIndex;
          const indexSearchState =
            searchState.indices && searchState.indices[index]
              ? searchState.indices[index]
              : {};

          return searchParameters.setQuery(indexSearchState.query || fallback);
        }

        return searchParameters.setQuery(searchState.query || fallback);
      },
      getMetadata: () => null,
      getId: () => 'id',
    })(() => null);

  const requiredProps = {
    indexName: 'indexName',
    searchClient: createSearchClient(),
  };

  it('throws an error if props are not provided', () => {
    const App = () => <div />;

    const trigger = () => findResultsState(App);

    expect(() => trigger()).toThrowErrorMatchingInlineSnapshot(
      `"The function \`findResultsState\` must be called with props: \`findResultsState(App, props)\`"`
    );
  });

  it('throws an error if props does not have a `searchClient`', () => {
    const App = () => <div />;

    const props = {};

    const trigger = () => findResultsState(App, props);

    expect(() => trigger()).toThrowErrorMatchingInlineSnapshot(
      `"The props provided to \`findResultsState\` must have a \`searchClient\`"`
    );
  });

  it('throws an error if props does not have an `indexName`', () => {
    const App = () => <div />;

    const props = {
      searchClient: createSearchClient(),
    };

    const trigger = () => findResultsState(App, props);

    expect(() => trigger()).toThrowErrorMatchingInlineSnapshot(
      `"The props provided to \`findResultsState\` must have an \`indexName\`"`
    );
  });

  it('adds expected Clinia agents', () => {
    const App = props => <Vision {...props} />;

    const searchClient = {
      ...createSearchClient(),
      addCliniaAgent: jest.fn(),
    };

    const props = {
      ...requiredProps,
      searchClient,
    };

    findResultsState(App, props);

    // The `addCliniaAgent` method is called 7 times:
    // - 1 times with @clinia/react-vision-dom/server
    // - 2 times with @clinia/react-vision-core/Vision
    // - 4 times with the CliniasearchHelper

    expect(searchClient.addCliniaAgent).toHaveBeenCalledTimes(7);
    expect(searchClient.addCliniaAgent).toHaveBeenCalledWith(
      `react (${React.version})`
    );
    expect(searchClient.addCliniaAgent).toHaveBeenCalledWith(
      `react-vision (${version})`
    );
    expect(searchClient.addCliniaAgent).toHaveBeenCalledWith(
      `react-vision-server (${version})`
    );
  });

  it('does not throw if `searchClient` does not have a `addCliniaAgent()` method', () => {
    const App = () => <div />;

    const props = {
      ...requiredProps,
      searchClient: createSearchClient(),
    };

    const trigger = () => findResultsState(App, props);

    expect(() => trigger()).not.toThrow();
  });

  describe('single index', () => {
    it('results should be state & results', async () => {
      const Connected = createWidget();

      const App = props => (
        <Vision {...props}>
          <Connected />
        </Vision>
      );

      const props = {
        ...requiredProps,
      };

      const results = await findResultsState(App, props);

      expect(results).toEqual({
        state: expect.any(SearchParameters),
        rawResults: expect.arrayContaining([
          expect.objectContaining({ meta: { query: expect.any(String) } }),
        ]),
      });
    });

    it('searchParameters should be cleaned each time', async () => {
      const getSearchParameters = jest.fn();
      const Connected = createWidget({
        getSearchParameters,
      });

      const App = props => (
        <Vision {...props}>
          <Connected />
        </Vision>
      );

      const props = {
        ...requiredProps,
      };

      await findResultsState(App, props);

      expect(getSearchParameters).toHaveBeenCalledTimes(1);

      getSearchParameters.mockClear();

      await findResultsState(App, props);

      expect(getSearchParameters).toHaveBeenCalledTimes(1);
    });

    it('without search state', async () => {
      const Connected = createWidget();

      const App = props => (
        <Vision {...props}>
          <Connected />
        </Vision>
      );

      const props = {
        ...requiredProps,
      };

      const data = await findResultsState(App, props);

      expect(data).toEqual({
        rawResults: [
          expect.objectContaining({
            index: 'indexName',
            meta: { query: 'Apple' },
          }),
        ],
        state: expect.objectContaining({ index: 'indexName', query: 'Apple' }),
      });
    });

    it('with search state', async () => {
      const Connected = createWidget();

      const App = props => (
        <Vision {...props}>
          <Connected />
        </Vision>
      );

      const props = {
        ...requiredProps,
        searchState: {
          query: 'iPhone',
        },
      };

      const data = await findResultsState(App, props);

      expect(data).toEqual({
        rawResults: [
          expect.objectContaining({
            index: 'indexName',
            meta: { query: 'iPhone' },
          }),
        ],
        state: expect.objectContaining({
          index: 'indexName',
          query: 'iPhone',
        }),
      });
    });
  });

  describe('multi index', () => {
    it('results should be instance of SearchResults and SearchParameters', async () => {
      const Connected = createWidget();

      const App = props => (
        <Vision {...props}>
          <Index indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
      };

      const results = await findResultsState(App, props);

      results.forEach(result => {
        expect(result.state).toBeInstanceOf(SearchParameters);
        expect(result.rawResults).toBeInstanceOf(Array);
      });
    });

    it('searchParameters should be cleaned each time', async () => {
      const getSearchParameters = jest.fn();
      const Connected = createWidget({
        getSearchParameters,
      });

      const App = props => (
        <Vision {...props}>
          <Index indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
      };

      await findResultsState(App, props);

      expect(getSearchParameters).toHaveBeenCalledTimes(1);

      getSearchParameters.mockClear();

      await findResultsState(App, props);

      expect(getSearchParameters).toHaveBeenCalledTimes(1);
    });

    it('without search state - first API', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Index indexId="index1" indexName="index1">
            <Connected />
          </Index>

          <Index indexId="index2" indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({
          index: 'index1',
          query: 'Apple',
        }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'Apple' },
          }),
        ],
      });

      expect(second).toEqual({
        _internalIndexId: 'index2',
        state: expect.objectContaining({
          index: 'index2',
          query: 'Apple',
        }),
        rawResults: [
          expect.objectContaining({
            index: 'index2',
            meta: { query: 'Apple' },
          }),
        ],
      });
    });

    it('without search state - second API', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Connected />

          <Index indexId="index2" indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({ index: 'index1', query: 'Apple' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'Apple' },
          }),
        ],
      });

      expect(second).toEqual({
        _internalIndexId: 'index2',
        state: expect.objectContaining({ index: 'index2', query: 'Apple' }),
        rawResults: [
          expect.objectContaining({
            index: 'index2',
            meta: { query: 'Apple' },
          }),
        ],
      });
    });

    it('without search state - same index', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Connected defaultRefinement="Apple" />

          <Index indexId="index1_with_refinement" indexName="index1">
            <Connected defaultRefinement="iWatch" />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({ index: 'index1', query: 'Apple' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'Apple' },
          }),
        ],
      });

      expect(second).toEqual({
        _internalIndexId: 'index1_with_refinement',
        state: expect.objectContaining({ index: 'index1', query: 'iWatch' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'iWatch' },
          }),
        ],
      });
    });

    it('with search state - first API', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Index indexId="index1" indexName="index1">
            <Connected />
          </Index>

          <Index indexId="index2" indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
        searchState: {
          indices: {
            index1: {
              query: 'iPhone',
            },
            index2: {
              query: 'iPad',
            },
          },
        },
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({ index: 'index1', query: 'iPhone' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'iPhone' },
          }),
        ],
      });

      expect(second).toEqual({
        _internalIndexId: 'index2',
        state: expect.objectContaining({ index: 'index2', query: 'iPad' }),
        rawResults: [
          expect.objectContaining({ index: 'index2', meta: { query: 'iPad' } }),
        ],
      });
    });

    it('with search state - second API', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Connected />

          <Index indexId="index2" indexName="index2">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
        searchState: {
          query: 'iPhone',
          indices: {
            index2: {
              query: 'iPad',
            },
          },
        },
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({ index: 'index1', query: 'iPhone' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'iPhone' },
          }),
        ],
      });

      expect(second).toEqual({
        _internalIndexId: 'index2',
        state: expect.objectContaining({ index: 'index2', query: 'iPad' }),
        rawResults: [
          expect.objectContaining({ index: 'index2', meta: { query: 'iPad' } }),
        ],
      });
    });

    it('with search state - same index', async () => {
      const Connected = createWidget();
      const App = props => (
        <Vision {...props}>
          <Connected />

          <Index indexId="index1WithRefinement" indexName="index1">
            <Connected />
          </Index>
        </Vision>
      );

      const props = {
        ...requiredProps,
        indexName: 'index1',
        searchState: {
          query: 'iPhone',
          indices: {
            index1WithRefinement: {
              query: 'iPad',
            },
          },
        },
      };

      const data = await findResultsState(App, props);

      expect(data).toHaveLength(2);

      const [first, second] = data;

      expect(first).toEqual({
        _internalIndexId: 'index1',
        state: expect.objectContaining({ index: 'index1', query: 'iPhone' }),
        rawResults: [
          expect.objectContaining({
            index: 'index1',
            meta: { query: 'iPhone' },
          }),
        ],
      });
      expect(second).toEqual({
        _internalIndexId: 'index1WithRefinement',
        state: expect.objectContaining({ index: 'index1', query: 'iPad' }),
        rawResults: [
          expect.objectContaining({ index: 'index1', meta: { query: 'iPad' } }),
        ],
      });
    });
  });
});
