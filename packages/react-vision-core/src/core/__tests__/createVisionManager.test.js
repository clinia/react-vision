import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import createVisionManager from '../createVisionManager';

Enzyme.configure({ adapter: new Adapter() });

jest.useFakeTimers();

const createSearchClient = () => ({
  search: jest.fn(() =>
    Promise.resolve({
      results: [
        {
          index: 'index',
          records: [],
          meta: {
            query: '',
            page: 0,
            numPages: 0,
            perPage: 10,
            total: 0,
          },
        },
      ],
    })
  ),
  initPlaces: jest.fn(),
});

describe('createVisionManager', () => {
  it('initializes the manager with an empty state', () => {
    const vm = createVisionManager({
      indexName: 'index',
      searchClient: createSearchClient(),
    });

    expect(vm.store.getState()).toEqual({
      error: null,
      isSearchStalled: true,
      metadata: [],
      results: null,
      resultsSuggestions: null,
      resultsLocations: null,
      searching: false,
      searchingForSuggestions: false,
      searchingForLocations: false,
      widgets: {},
    });

    expect(vm.widgetsManager.getWidgets()).toEqual([]);

    expect(vm.transitionState({})).toEqual({});

    expect(vm.getWidgetsIds()).toEqual([]);
  });
});
