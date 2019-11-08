import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import {
  VisionConsumer,
  VisionContext,
  IndexProvider,
  IndexContext,
} from '../core/context';

function getIndexContext(props: Props): IndexContext {
  return {
    targetedIndex: props.indexId,
  };
}

type Props = {
  indexName: string;
  indexId: string;
};

type InnerProps = Props & { contextValue: VisionContext };

type State = {
  indexContext: IndexContext;
};

/**
 * The component that allows you to apply widgets to a dedicated index. It's
 * useful if you want to build an interface that targets multiple indices.
 *
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision. Index, SearcbBox, Hits, Configure } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *  'TODO',
 *  'test'
 * );
 *
 * const App = () => (
 *   <Vision searchClient={searchClient} indexName="health_facility">
 *     <Configure perPage={5} />
 *     <SearcbBox />
 *     <Index indexName="health_facility">
 *       <Hits />
 *     </Index>
 *     <Index indexName="professional">
 *       <Hits />
 *     </Index>
 *   </Vision>
 * );
 */
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
    <VisionConsumer>
      {contextValue => (
        <Index
          contextValue={contextValue}
          indexId={inferredIndexId}
          {...props}
        />
      )}
    </VisionConsumer>
  );
};

IndexWrapper.propTypes = {
  indexName: PropTypes.string.isRequired,
  indexId: PropTypes.string,
};

export const IndexComponentWithoutContext = Index;
export default IndexWrapper;
