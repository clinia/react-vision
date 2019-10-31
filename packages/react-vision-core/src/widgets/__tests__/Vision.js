import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import createVisionManager from '../../core/createVisionManager';
import Vision from '../Vision';
import { VisionConsumer } from '../../core/context';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('../../core/createVisionManager');

const createFakeStore = (rest = {}) => ({
  getState: jest.fn(() => ({})),
  setState: jest.fn(),
  subscribe: jest.fn(),
  ...rest,
});

const createFakeVisionManager = (rest = {}) => ({
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

describe('Vision', () => {
  beforeEach(() => {
    createVisionManager.mockImplementation(() => createFakeVisionManager());
  });

  afterEach(() => {
    createVisionManager.mockClear();
  });

  it('validates its props', () => {
    expect(() => {
      shallow(
        <Vision {...DEFAULT_PROPS}>
          <div />
        </Vision>
      );
    }).not.toThrow();

    expect(() => {
      shallow(<Vision {...DEFAULT_PROPS} />);
    }).not.toThrow();

    expect(() => {
      shallow(
        <Vision {...DEFAULT_PROPS}>
          <div />
          <div />
        </Vision>
      );
    }).not.toThrow();

    expect(() => {
      const wrapper = shallow(
        <Vision
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={() => null}
          refresh={false}
        >
          <div />
        </Vision>
      );
      wrapper.setProps({
        searchState: undefined,
      });
    }).toThrow(
      "You can't switch <Vision> from being controlled to uncontrolled"
    );

    expect(() => {
      const wrapper = shallow(
        <Vision {...DEFAULT_PROPS}>
          <div />
        </Vision>
      );
      wrapper.setProps({
        searchState: {},
        onSearchStateChange: () => null,
        createURL: () => null,
      });
    }).toThrow(
      "You can't switch <Vision> from being uncontrolled to controlled"
    );

    expect(() => {
      const wrapper = shallow(
        <Vision
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={() => null}
        >
          <div />
        </Vision>
      );
      wrapper.setProps({
        searchState: undefined,
        onSearchStateChange: undefined,
        createURL: undefined,
      });
    }).toThrow(
      "You can't switch <Vision> from being controlled to uncontrolled"
    );
  });

  it('correctly instantiates the visionManager', () => {
    mount(
      <Vision {...DEFAULT_PROPS}>
        <div />
      </Vision>
    );
    expect(createVisionManager.mock.calls[0][0]).toEqual({
      indexName: DEFAULT_PROPS.indexName,
      initialState: {},
      searchClient: DEFAULT_PROPS.searchClient,
      stalledSearchDelay: 200,
    });
  });

  it('updates Clinia client when new one is given in props', () => {
    const vm = createFakeVisionManager();

    createVisionManager.mockImplementation(() => vm);

    const wrapper = mount(
      <Vision {...DEFAULT_PROPS}>
        <div />
      </Vision>
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
      const vm = createVisionManager({
        transitionState: searchState => ({
          ...searchState,
          transitioned: true,
        }),
        getWidgetsIds: () => widgetsIds,
      });
      createVisionManager.mockImplementation(() => vm);
      const createURL = jest.fn(searchState => searchState);

      let childContext;
      mount(
        <Vision
          {...DEFAULT_PROPS}
          searchState={{}}
          onSearchStateChange={() => null}
          createURL={createURL}
        >
          <VisionConsumer>
            {contextValue => {
              childContext = contextValue;
              return null;
            }}
          </VisionConsumer>
        </Vision>
      );

      const { createHrefForState } = childContext;
      const outputURL = createHrefForState({ a: 1 });
      expect(outputURL).toEqual({ a: 1, transitioned: true });
      expect(createURL.mock.calls[0][1]).toBe(widgetsIds);
    });

    it('returns # otherwise', () => {
      let childContext;
      mount(
        <Vision {...DEFAULT_PROPS}>
          <VisionConsumer>
            {contextValue => {
              childContext = contextValue;
              return null;
            }}
          </VisionConsumer>
        </Vision>
      );

      const { createHrefForState } = childContext;
      const outputURL = createHrefForState({ a: 1 });
      expect(outputURL).toBe('#');
    });
  });
});
