import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { createClassNames } from '../core/utils';
import { translatable } from '@clinia/react-vision-core';
import { defaultLoadingIndicator } from './defaultComponents';

export type Record = {
  id: string;
};

type HitProps = {
  hit: Record;
};

type Props = {
  hits: Record[];
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  noResultsFound?: React.ReactNode;
  hit?: React.FunctionComponent<HitProps>;
  translate?: any;
};

const DefaultHit: React.FC<HitProps> = ({ hit }) => {
  return (
    <div
      style={{
        borderBottom: '1px solid #bbb',
        paddingBottom: '5px',
        marginBottom: '5px',
        wordBreak: 'break-all',
      }}
    >
      <h4>{hit.id}</h4>
      <code>{JSON.stringify(hit, null, 2)}</code>
    </div>
  );
};

DefaultHit.propTypes = {
  hit: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const cx = createClassNames('hits');

const Hits: React.FunctionComponent<Props> = ({
  hits,
  className = '',
  style = {},
  hit: HitComponent = DefaultHit,
  noResultsFound,
  translate,
  loading,
}) => {
  return loading ? (
    defaultLoadingIndicator(cx)
  ) : (
    <div className={classnames(cx(''), className)} style={style}>
      <div className={cx('list')}>
        {Array.isArray(hits) && hits.length > 0
          ? hits.map(hit => (
              <div className={cx('item')} key={hit.id}>
                <HitComponent hit={hit} />
              </div>
            ))
          : noResultsFound || (
              <div className={cx('empty')}>{translate('emptySearch')}</div>
            )}
      </div>
    </div>
  );
};

const HitPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

Hits.propTypes = {
  hits: PropTypes.arrayOf(HitPropTypes.isRequired).isRequired,
  className: PropTypes.string,
  noResultsFound: PropTypes.func,
  translate: PropTypes.func,
  loading: PropTypes.bool,
  style: PropTypes.object,
  hit: PropTypes.func,
};

export default translatable({
  emptySearch: 'No results were found',
})(Hits);
