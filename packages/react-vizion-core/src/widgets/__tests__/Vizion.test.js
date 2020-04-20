import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import createVizionManager from '../../core/createVizionManager';
import Vizion from '../Vizion';
import { VizionConsumer } from '../../core/context';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../../core/createVizionManager');

const createFakeStore = (rest = {}) => ({
  getState: jest.fn(() => ({})),
  setState: jest.fn(),
  subscribe: jest.fn(),
  ...rest,
});

const createFakeVizionManager = (rest = {}) => ({
  context: {},
  store: createFakeStore(),
  clearCache: jest.fn(),
  updateIndex: jest.fn(),
  updateClient: jest.fn(),
  skipSearch: jest.fn(),
  getWidgetsIds: jest.fn(),
  onExternalStateUpdate: jest.fn(),
  transitionState: jest.fn(),
  ...rest,
});

const createFakeSearchClient = (rest = {}) => ({
  search: jest.fn(),
  ...rest,
});

const DEFAULT_PROPS = {
  appId: 'foo',
  apiKey: 'bar',
  indexName: 'foobar',
  searchClient: createFakeSearchClient(),
  root: {
    Root: 'div',
  },
  refresh: false,
};

describe('Vizion', () => {
  beforeEach(() => {
    createVizionManager.mockImplementation(() => createFakeVizionManager());
  });

  afterEach(() => {
    createVizionManager.mockClear();
  });

  it('validates its props', () => {
    expect(() => {
      shallow(
        <Vizion {...DEFAULT_PROPS}>
          <div />
        </Vizion>
      );
    }).not.toThrow();

    expect(() => {
      shallow(<Vizion {...DEFAULT_PROPS} />);
    }).not.toThrow();

    expect(() => {
      shallow(
        <Vizion {...DEFAULT_PROPS}>
          <div />
          <div />
        </Vizion>
      );
    }).not.toThrow();

    expect(() => {
      const wrapper = shallow(
        <Vizion
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={() => null}
          refresh={false}
        >
          <div />
        </Vizion>
      );
      wrapper.setProps({
        searchState: undefined,
      });
    }).toThrow(
      "You can't switch <Vizion> from being controlled to uncontrolled"
    );

    expect(() => {
      const wrapper = shallow(
        <Vizion {...DEFAULT_PROPS}>
          <div />
        </Vizion>
      );
      wrapper.setProps({
        searchState: {},
        onSearchStateChange: () => null,
        createURL: () => null,
      });
    }).toThrow(
      "You can't switch <Vizion> from being uncontrolled to controlled"
    );

    expect(() => {
      const wrapper = shallow(
        <Vizion
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={() => null}
        >
          <div />
        </Vizion>
      );
      wrapper.setProps({
        searchState: undefined,
        onSearchStateChange: undefined,
        createURL: undefined,
      });
    }).toThrow(
      "You can't switch <Vizion> from being controlled to uncontrolled"
    );
  });

  it('correctly instantiates the vizionManager', () => {
    mount(
      <Vizion {...DEFAULT_PROPS}>
        <div />
      </Vizion>
    );
    expect(createVizionManager.mock.calls[0][0]).toEqual({
      indexName: DEFAULT_PROPS.indexName,
      initialState: {},
      searchClient: DEFAULT_PROPS.searchClient,
      stalledSearchDelay: 200,
    });
  });

  it('updates Clinia client when new one is given in props', () => {
    const vm = createFakeVizionManager();

    createVizionManager.mockImplementation(() => vm);

    const wrapper = mount(
      <Vizion {...DEFAULT_PROPS}>
        <div />
      </Vizion>
    );

    expect(vm.updateClient).toHaveBeenCalledTimes(0);

    wrapper.setProps({
      ...DEFAULT_PROPS,
      searchClient: createFakeSearchClient(),
    });

    expect(vm.updateClient).toHaveBeenCalledTimes(1);
  });

  describe('createHrefForState', () => {
    it('passes through to createURL when it is defined', () => {
      const widgetsIds = [];
      const vm = createFakeVizionManager({
        transitionState: searchState => ({
          ...searchState,
          transitioned: true,
        }),
        getWidgetsIds: () => widgetsIds,
      });
      createVizionManager.mockImplementation(() => vm);
      const createURL = jest.fn(searchState => searchState);

      let childContext;
      mount(
        <Vizion
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={createURL}
        >
          <VizionConsumer>
            {contextValue => {
              childContext = contextValue;
              return null;
            }}
          </VizionConsumer>
        </Vizion>
      );

      const { createHrefForState } = childContext;
      const outputURL = createHrefForState({ a: 1 });
      expect(outputURL).toEqual({ a: 1, transitioned: true });
      expect(createURL.mock.calls[0][1]).toBe(widgetsIds);
    });

    it('returns # otherwise', () => {
      let childContext;
      mount(
        <Vizion {...DEFAULT_PROPS}>
          <VizionConsumer>
            {contextValue => {
              childContext = contextValue;
              return null;
            }}
          </VizionConsumer>
        </Vizion>
      );

      const { createHrefForState } = childContext;
      const outputURL = createHrefForState({ a: 1 });
      expect(outputURL).toBe('#');
    });
  });
});
