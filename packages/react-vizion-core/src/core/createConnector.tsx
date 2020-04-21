import React, { Component, ReactType } from 'react';
import isEqual from 'react-fast-compare';
import { shallowEqual, getDisplayName, removeEmptyKey } from './utils';
import {
  VizionConsumer,
  VizionContext,
  IndexConsumer,
  IndexContext,
} from './context';

export type ConnectorDescription = {
  displayName: string;
  /**
   * a function to filter the local state
   */
  refine?: (...args: any[]) => any;
  /**
   * function transforming the local state to a SearchParameters
   */
  getSearchParameters?: (...args: any[]) => any;
  /**
   * metadata of the widget (for current refinements)
   */
  getMetadata?: (...args: any[]) => any;
  /**
   * hook after the state has changed
   */
  transitionState?: (...args: any[]) => any;
  /**
   * transform the state into props passed to the wrapped component.
   * Receives (props, widgetStates, searchState, metadata) and returns the local state.
   */
  getProvidedProps: (...args: any[]) => any;
  /**
   * Receives props and return the id that will be used to identify the widget
   */
  getId?: (...args: any[]) => string;
  /**
   * hook when the widget will unmount. Receives (props, searchState) and return a cleaned state.
   */
  cleanUp?: (...args: any[]) => any;
  shouldComponentUpdate?: (...args: any[]) => boolean;
  /**
   * PropTypes forwarded to the wrapped component.
   */
  propTypes?: {}; // I can't find a definition for a propTypes object
  defaultProps?: {};
};

type ConnectorProps = {
  contextValue: VizionContext;
  indexContextValue?: IndexContext;
};

export type ConnectedProps<TWidgetProps> = TWidgetProps & ConnectorProps;

type ConnectorState = {
  providedProps: {};
};

/**
 * Connectors are the HOC used to transform React components
 * into Vizion widgets.
 * In order to simplify the construction of such connectors
 * `createConnector` takes a description and transform it into
 * a connector.
 * @param {ConnectorDescription} connectorDesc the description of the connector
 * @return {Connector} a function that wraps a component into
 * a vizion connected one.
 */
export function createConnectorWithoutContext(
  connectorDesc: ConnectorDescription
) {
  if (!connectorDesc.displayName) {
    throw new Error(
      '`createConnector` requires you to provide a `displayName` property.'
    );
  }

  const isWidget =
    typeof connectorDesc.getSearchParameters === 'function' ||
    typeof connectorDesc.getMetadata === 'function' ||
    typeof connectorDesc.transitionState === 'function';

  return (Composed: ReactType) => {
    class Connector extends Component<ConnectorProps, ConnectorState> {
      static displayName = `${connectorDesc.displayName}(${getDisplayName(
        Composed
      )})`;
      static propTypes = connectorDesc.propTypes;
      static defaultProps = connectorDesc.defaultProps;

      unsubscribe?: () => void;
      unregisterWidget?: () => void;

      isUnmounting = false;

      state: ConnectorState = {
        providedProps: this.getProvidedProps(this.props),
      };

      constructor(props: ConnectorProps) {
        super(props);

        if (connectorDesc.getSearchParameters) {
          this.props.contextValue.onSearchParameters(
            connectorDesc.getSearchParameters.bind(this),
            {
              cvi: this.props.contextValue,
              multiIndexContext: this.props.indexContextValue,
            },
            this.props
          );
        }
      }

      componentDidMount() {
        this.unsubscribe = this.props.contextValue.store.subscribe(() => {
          if (!this.isUnmounting) {
            this.setState({
              providedProps: this.getProvidedProps(this.props),
            });
          }
        });

        if (isWidget) {
          this.unregisterWidget = this.props.contextValue.widgetsManager.registerWidget(
            this
          );
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (typeof connectorDesc.shouldComponentUpdate === 'function') {
          return connectorDesc.shouldComponentUpdate.call(
            this,
            this.props,
            nextProps,
            this.state,
            nextState
          );
        }

        const propsEqual = shallowEqual(this.props, nextProps);

        if (
          this.state.providedProps === null ||
          nextState.providedProps === null
        ) {
          if (this.state.providedProps === nextState.providedProps) {
            return !propsEqual;
          }
          return true;
        }

        return (
          !propsEqual ||
          !shallowEqual(this.state.providedProps, nextState.providedProps)
        );
      }

      componentDidUpdate(prevProps) {
        if (!isEqual(prevProps, this.props)) {
          this.setState({
            providedProps: this.getProvidedProps(this.props),
          });

          if (isWidget) {
            this.props.contextValue.widgetsManager.update();

            if (typeof connectorDesc.transitionState === 'function') {
              this.props.contextValue.onSearchStateChange(
                connectorDesc.transitionState.call(
                  this,
                  this.props,
                  this.props.contextValue.store.getState().widgets,
                  this.props.contextValue.store.getState().widgets
                )
              );
            }
          }
        }
      }

      componentWillUnmount() {
        this.isUnmounting = true;

        if (this.unsubscribe) {
          this.unsubscribe();
        }

        if (this.unregisterWidget) {
          this.unregisterWidget();

          if (typeof connectorDesc.cleanUp === 'function') {
            const nextState = connectorDesc.cleanUp.call(
              this,
              this.props,
              this.props.contextValue.store.getState().widgets
            );

            this.props.contextValue.store.setState({
              ...this.props.contextValue.store.getState(),
              widgets: nextState,
            });

            this.props.contextValue.onSearchStateChange(
              removeEmptyKey(nextState)
            );
          }
        }
      }

      getProvidedProps(props) {
        const {
          widgets,
          results,
          searching,
          isSearchStalled,
          metadata,
          error,
        } = this.props.contextValue.store.getState();

        const searchResults = {
          results,
          searching,
          isSearchStalled,
          error,
        };

        return connectorDesc.getProvidedProps.call(
          this,
          props,
          widgets,
          searchResults,
          metadata
        );
      }

      getSearchParameters(searchParameters) {
        if (typeof connectorDesc.getSearchParameters === 'function') {
          return connectorDesc.getSearchParameters.call(
            this,
            searchParameters,
            this.props,
            this.props.contextValue.store.getState().widgets
          );
        }

        return null;
      }

      getMetadata(nextWidgetsState) {
        if (typeof connectorDesc.getMetadata === 'function') {
          return connectorDesc.getMetadata.call(
            this,
            this.props,
            nextWidgetsState
          );
        }

        return {};
      }

      transitionState(prevWidgetsState, nextWidgetsState) {
        if (typeof connectorDesc.transitionState === 'function') {
          return connectorDesc.transitionState.call(
            this,
            this.props,
            prevWidgetsState,
            nextWidgetsState
          );
        }

        return nextWidgetsState;
      }

      refine = (...args) => {
        this.props.contextValue.onInternalStateUpdate(
          // refine will always be defined here because the prop is only given conditionally
          connectorDesc.refine!.call(
            this,
            this.props,
            this.props.contextValue.store.getState().widgets,
            ...args
          )
        );
      };

      createURL = (...args) =>
        this.props.contextValue.createHrefForState(
          // refine will always be defined here because the prop is only given conditionally
          connectorDesc.refine!.call(
            this,
            this.props,
            this.props.contextValue.store.getState().widgets,
            ...args
          )
        );

      render() {
        const { contextValue, ...props } = this.props;
        const { providedProps } = this.state;

        if (providedProps === null) {
          return null;
        }

        const refineProps =
          typeof connectorDesc.refine === 'function'
            ? { refine: this.refine, createURL: this.createURL }
            : {};

        return <Composed {...props} {...providedProps} {...refineProps} />;
      }
    }

    return Connector;
  };
}

const createConnectorWithContext = (connectorDesc: ConnectorDescription) => (
  Composed: ReactType
) => {
  const Connector = createConnectorWithoutContext(connectorDesc)(Composed);

  const ConnectorWrapper: React.FC<any> = props => (
    <VizionConsumer>
      {contextValue => (
        <IndexConsumer>
          {indexContextValue => (
            <Connector
              contextValue={contextValue}
              indexContextValue={indexContextValue}
              {...props}
            />
          )}
        </IndexConsumer>
      )}
    </VizionConsumer>
  );

  return ConnectorWrapper;
};

export default createConnectorWithContext;