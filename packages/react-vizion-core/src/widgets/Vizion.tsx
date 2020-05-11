import React, { Component, Children } from 'react';
import isEqual from 'react-fast-compare';
import PropTypes from 'prop-types';
import createVizionManager from '../core/createVizionManager';
import { VizionProvider, VizionContext } from '../core/context';
import { PlainSearchParameters, SearchParameters } from '@clinia/search-helper';
import { MultiResponse } from '../types';
import { Store } from '../core/createStore';

type ResultsState = {
  state: PlainSearchParameters;
  rawResults: MultiResponse;
};

// @TODO: move to createVizionManager when it's TS
type VizionManager = {
  store: Store;
  widgetsManager: any;
  getWidgetsIds: any;
  getSearchParameters: (
    ...args: any[]
  ) => {
    mainParameters: SearchParameters;
    derivedParameters: SearchParameters;
  };
  onExternalStateUpdate: (...args: any[]) => any;
  onSearchForQuerySuggestions: (...args: any[]) => any;
  onSearchForLocations: (...args: any[]) => any;
  transitionState: any;
  updateClient: any;
  updateIndex: any;
  clearCache: () => void;
  skipSearch: any;
};

type SearchClient = {
  search: (requests: Array<{}>) => Promise<{}>;
};

type SearchState = any;

type Props = {
  refresh: boolean;
  indexName: string;
  searchClient: SearchClient;
  createURL?: (searchState: SearchState, knownKeys: any) => string;
  onSearchStateChange?: (searchState: SearchState) => void;
  searchState?: SearchState;
  onSearchParameters?: (
    getSearchParameters: (...args: any) => any,
    context: any,
    props: any,
    searchState: SearchState
  ) => void;
  stalledSearchDelay?: number;
  resultsState: ResultsState | { [indexId: string]: ResultsState };
};

type State = {
  isControlled: boolean;
  vizionManager: VizionManager;
  contextValue: VizionContext;
};

function isControlled(props: Props) {
  return Boolean(props.searchState);
}

/**
 * @module Vizion
 */

/**
 * `Vizion` is the root component of all React Vizion implementations.
 * It provides all the connected components (aka widgets) a mean to interact
 * with the searchState.
 * @alias module:Vizion
 * @kind widget
 * @name <Vizion>
 * @requirements You will need to have an Clinia account to be able to use this widget.
 * @propType {string} indexName - Main index in which to search.
 * @propType {boolean} [refresh=false] - Flag to activate when the cache needs to be cleared so that the front-end is updated when a change occurs in the index.
 * @propType {object} [searchClient] - Provide a custom search client.
 * @propType {func} [onSearchStateChange] - Function to be called everytime a new search is done. Useful for.
 * @propType {object} [searchState] - Object to inject some search state. Switches the Vizion component in controlled mode.
 * @propType {func} [createURL] - Function to call when creating links, useful for URL Routing.
 * @propType {SearchResults|SearchResults[]} [resultsState] - Use this to inject the results that will be used at first rendering. Those results are found by using the `findResultsState` function. Useful for [Server Side Rendering](guide/Server-side_rendering.html).
 * @propType {number} [stalledSearchDelay=200] - The amount of time before considering that the search takes too much time. The time is expressed in milliseconds.
 * @propType {{ Root: string|function, props: object }} [root] - Use this to customize the root element. Default value: `{ Root: 'div' }`
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, SearchBox, Hits } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'TODO',
 *   'test'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <SearchBox />
 *     <Hits />
 *   </Vizion>
 * );
 */
export default class Vizion extends Component<Props, State> {
  static defaultProps = {
    stalledSearchDelay: 200,
    refresh: false,
  };

  static propTypes = {
    // @TODO: These props are currently constant.
    indexName: PropTypes.string.isRequired,

    searchClient: PropTypes.shape({
      search: PropTypes.func.isRequired,
      addCliniaAgent: PropTypes.func,
      clearCache: PropTypes.func,
    }).isRequired,

    createURL: PropTypes.func,

    refresh: PropTypes.bool,

    searchState: PropTypes.object,
    onSearchStateChange: PropTypes.func,

    onSearchParameters: PropTypes.func,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

    children: PropTypes.node,
    stalledSearchDelay: PropTypes.number,
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): Partial<State> {
    const nextIsControlled = isControlled(nextProps);
    const previousSearchState = prevState.vizionManager.store.getState()
      .widgets;
    const nextSearchState = nextProps.searchState;

    if (nextIsControlled && !isEqual(previousSearchState, nextSearchState)) {
      prevState.vizionManager.onExternalStateUpdate(nextProps.searchState);
    }

    return {
      isControlled: nextIsControlled,
      contextValue: {
        ...prevState.contextValue,
        mainTargetedIndex: nextProps.indexName,
      },
    };
  }

  isUnmounting: boolean = false;

  constructor(props: Props) {
    super(props);

    const vizionManager = createVizionManager({
      indexName: this.props.indexName,
      searchClient: this.props.searchClient,
      initialState: this.props.searchState || {},
      resultsState: this.props.resultsState,
      stalledSearchDelay: this.props.stalledSearchDelay,
    });

    const contextValue = {
      store: vizionManager.store,
      widgetsManager: vizionManager.widgetsManager,
      mainTargetedIndex: this.props.indexName,
      onInternalStateUpdate: this.onWidgetsInternalStateUpdate.bind(this),
      createHrefForState: this.createHrefForState.bind(this),
      onSearchStateChange: this.onSearchStateChange.bind(this),
      onSearchParameters: this.onSearchParameters.bind(this),
      onSearchForQuerySuggestions: this.onSearchForQuerySuggestions.bind(this),
      onSearchForLocations: this.onSearchForLocations.bind(this),
    };

    this.state = {
      isControlled: isControlled(this.props),
      vizionManager,
      contextValue,
    };
  }

  componentDidUpdate(prevProps: Props) {
    const prevIsControlled = isControlled(prevProps);

    if (prevIsControlled && !this.state.isControlled) {
      throw new Error(
        "You can't switch <Vizion> from being controlled to uncontrolled"
      );
    }

    if (!prevIsControlled && this.state.isControlled) {
      throw new Error(
        "You can't switch <Vizion> from being uncontrolled to controlled"
      );
    }

    if (this.props.refresh !== prevProps.refresh && this.props.refresh) {
      this.state.vizionManager.clearCache();
    }

    if (prevProps.indexName !== this.props.indexName) {
      this.state.vizionManager.updateIndex(this.props.indexName);
    }

    if (prevProps.searchClient !== this.props.searchClient) {
      this.state.vizionManager.updateClient(this.props.searchClient);
    }
  }

  componentWillUnmount() {
    this.isUnmounting = true;
    this.state.vizionManager.skipSearch();
  }

  createHrefForState(searchState: SearchState) {
    searchState = this.state.vizionManager.transitionState(searchState);
    return this.state.isControlled && this.props.createURL
      ? this.props.createURL(searchState, this.getKnownKeys())
      : '#';
  }

  onWidgetsInternalStateUpdate(searchState: SearchState) {
    searchState = this.state.vizionManager.transitionState(searchState);

    this.onSearchStateChange(searchState);

    if (!this.state.isControlled) {
      this.state.vizionManager.onExternalStateUpdate(searchState);
    }
  }

  onSearchStateChange(searchState) {
    if (this.props.onSearchStateChange && !this.isUnmounting) {
      this.props.onSearchStateChange(searchState);
    }
  }

  onSearchParameters(getSearchParameters, context, props) {
    if (this.props.onSearchParameters) {
      const searchState = this.props.searchState ? this.props.searchState : {};
      this.props.onSearchParameters(
        getSearchParameters,
        context,
        props,
        searchState
      );
    }
  }

  onSearchForQuerySuggestions(searchState) {
    this.state.vizionManager.onSearchForQuerySuggestions(searchState);
  }

  onSearchForLocations(searchState) {
    this.state.vizionManager.onSearchForLocations(searchState);
  }

  getKnownKeys() {
    return this.state.vizionManager.getWidgetsIds();
  }

  render() {
    if (Children.count(this.props.children) === 0) {
      return null;
    }

    return (
      <VizionProvider value={this.state.contextValue}>
        {this.props.children}
      </VizionProvider>
    );
  }
}
