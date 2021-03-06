import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import {
  VizionConsumer,
  VizionContext,
  IndexProvider,
  IndexContext,
} from '../core/context';

/**
 * @module Index
 */

function getIndexContext(props: Props): IndexContext {
  return {
    targetedIndex: props.indexId,
  };
}

type Props = {
  indexName: string;
  indexId: string;
};

type InnerProps = Props & { contextValue: VizionContext };

type State = {
  indexContext: IndexContext;
};

class Index extends Component<InnerProps, State> {
  static propTypes = {
    indexName: PropTypes.string.isRequired,
    indexId: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static getDerivedStateFromProps(props: InnerProps) {
    return {
      indexContext: getIndexContext(props),
    };
  }

  state = {
    indexContext: getIndexContext(this.props),
  };

  unregisterWidget?: () => void;

  constructor(props: InnerProps) {
    super(props);

    this.props.contextValue.onSearchParameters(
      this.getSearchParameters.bind(this),
      {
        cvi: this.props.contextValue,
        multiIndexContext: this.state.indexContext,
      },
      this.props
    );
  }

  componentDidMount() {
    this.unregisterWidget = this.props.contextValue.widgetsManager.registerWidget(
      this
    );
  }

  componentDidUpdate(prevProps: InnerProps) {
    if (this.props.indexName !== prevProps.indexName) {
      this.props.contextValue.widgetsManager.update();
    }
  }

  componentWillUnmount() {
    if (typeof this.unregisterWidget === 'function') {
      this.unregisterWidget();
    }
  }

  getSearchParameters(searchParameters, props: InnerProps) {
    return searchParameters.setIndex(
      this.props ? this.props.indexName : props.indexName
    );
  }

  render() {
    const childrenCount = Children.count(this.props.children);
    if (childrenCount === 0) {
      return null;
    }

    return (
      <IndexProvider value={this.state.indexContext}>
        {this.props.children}
      </IndexProvider>
    );
  }
}

type IndexWrapperProps = {
  indexName: string;
  indexId?: string;
};

const IndexWrapper: React.FC<IndexWrapperProps> = props => {
  const inferredIndexId = props.indexName;
  return (
    <VizionConsumer>
      {contextValue => (
        <Index
          contextValue={contextValue}
          indexId={inferredIndexId}
          {...props}
        />
      )}
    </VizionConsumer>
  );
};

IndexWrapper.propTypes = {
  indexName: PropTypes.string.isRequired,
  indexId: PropTypes.string,
};

export const IndexComponentWithoutContext = Index;

/**
 * The component that allows you to apply widgets to a dedicated index. It's
 * useful if you want to build an interface that targets multiple indexes.
 * @alias module:Index
 * @kind widget
 * @prop {string} indexName - The name of the targeted index. Value is either `health_facility` or `professional`.
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vizion. Index, SearcbBox, Hits, Configure } from '@clinia/react-vizion-dom';
 *
 * const searchClient = cliniasearch(
 *  'TODO',
 *  'test'
 * );
 *
 * const App = () => (
 *   <Vizion searchClient={searchClient} indexName="health_facility">
 *     <Configure perPage={5} />
 *     <SearchBox />
 *     <Index indexName="health_facility">
 *       <Hits />
 *     </Index>
 *     <Index indexName="professional">
 *       <Hits />
 *     </Index>
 *   </Vizion>
 * );
 */
export default IndexWrapper;
