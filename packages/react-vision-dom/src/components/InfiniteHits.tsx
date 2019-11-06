import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translatable } from 'react-vision-core';
import { createClassNames } from '../core/utils';
import { Translate } from 'react-vision-core/src';

const cx = createClassNames('InfiniteHits');

interface Props {
  className?: string;
  hitComponent?: (record: any) => JSX.Element;
  showPrevious?: boolean;

  records: any[];
  hasPrevious: boolean;
  hasMore: boolean;
  refinePrevious: () => void;
  refineNext: () => void;
  translate: Translate;
}

interface DefaultProps {
  className: string;
  hitComponent: (record: any) => JSX.Element;
  showPrevious: boolean;
}

type PropsWithDefaults = Props & DefaultProps;

class InfiniteHits extends PureComponent<Props> {
  static propTypes = {
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    hitComponent: record => (
      <div
        style={{
          borderBottom: '1px solid #bbb',
          paddingBottom: '5px',
          marginBottom: '5px',
          wordBreak: 'break-all',
        }}
      >
        {JSON.stringify(record).slice(0, 100)}
        ...
      </div>
    ),
  };

  render() {
    const {
      hitComponent: HitComponent,
      records,
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
          {records.map(record => (
            <li key={record.id} className={cx('item')}>
              <HitComponent record={record} />
            </li>
          ))}
        </ul>
        <button
          className={cx('loadMore', hasMore ? '' : 'loadMore--disabled')}
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
