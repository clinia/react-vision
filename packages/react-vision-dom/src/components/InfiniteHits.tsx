import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translatable, Translate } from '@clinia/react-vision-core';
import { createClassNames } from '../core/utils';

const cx = createClassNames('infinitehits');

interface Props {
  className?: string;
  hitComponent?: (hit: any) => JSX.Element;
  showPrevious?: boolean;

  hits: any[];
  hasPrevious: boolean;
  hasMore: boolean;
  refinePrevious: () => void;
  refineNext: () => void;
  translate: Translate;
}

interface DefaultProps {
  className: string;
  hitComponent: (hit: any) => JSX.Element;
  showPrevious: boolean;
}

type PropsWithDefaults = Props & DefaultProps;

class InfiniteHits extends PureComponent<Props> {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    showPrevious: PropTypes.bool.isRequired,
    hasPrevious: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    refinePrevious: PropTypes.func.isRequired,
    refineNext: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    className: PropTypes.string,
    hitComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  static defaultProps: DefaultProps = {
    className: '',
    showPrevious: false,
    hitComponent: hit => (
      <div
        style={{
          borderBottom: '1px solid #bbb',
          paddingBottom: '5px',
          marginBottom: '5px',
          wordBreak: 'break-all',
        }}
      >
        {JSON.stringify(hit).slice(0, 100)}
        ...
      </div>
    ),
  };

  render() {
    const {
      hitComponent: HitComponent,
      hits,
      showPrevious,
      hasPrevious,
      hasMore,
      refinePrevious,
      refineNext,
      translate,
      className,
    } = this.props as PropsWithDefaults;

    return (
      <div className={classNames(cx(''), className)}>
        {showPrevious && (
          <button
            className={cx(
              'loadPrevious',
              hasPrevious ? '' : 'loadPrevious--disabled'
            )}
            onClick={() => refinePrevious()}
            disabled={!hasPrevious}
          >
            {translate('loadPrevious')}
          </button>
        )}
        <ul className={cx('list')}>
          {hits.map(hit => (
            <li key={hit.id} className={cx('item')}>
              <HitComponent hit={hit} />
            </li>
          ))}
        </ul>
        <button
          className={classNames(
            cx('loadmore'),
            hasMore ? null : cx('loadmore--disabled')
          )}
          onClick={() => refineNext()}
          disabled={!hasMore}
        >
          {translate('loadMore')}
        </button>
      </div>
    );
  }
}

export default translatable({
  loadPrevious: 'Load previous',
  loadMore: 'Load more',
})(InfiniteHits);
