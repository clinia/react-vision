import React from 'react';
import classnames from 'classnames';
import { createClassNames } from '../core/utils';

export type Record = {
  id: string;
};

type HitProps = {
  records: Record[];
  className?: string;
  style?: React.CSSProperties;
  noResultsFound?: React.ReactNode;
  hit?: (record: Record) => React.ReactNode;
};

type DefaultHitProps = {
  record: Record;
};

const DefaultHit: React.FunctionComponent<DefaultHitProps> = ({ record }) => {
  return (
    <div className="default-hit-card">
      <h4 className="default-hit-title">{record.id}</h4>
      <div className="card-body">{JSON.stringify(record, null, 2)}</div>
    </div>
  );
};

const cx = createClassNames('Hits');

const Hits: React.FunctionComponent<HitProps> = ({
  records,
  className,
  style,
  hit,
  noResultsFound,
}) => {
  return (
    <div className={classnames(cx(''), className)} style={style}>
      <div className={cx('list')}>
        {Array.isArray(records) && records.length > 0
          ? records.map(record => (
              <div key={record.id}>
                {hit ? (
                  hit(record)
                ) : (
                  <>
                    <DefaultHit record={record} />
                  </>
                )}
              </div>
            ))
          : noResultsFound || <div className={cx('empty')}></div>}
      </div>
    </div>
  );
};

export default Hits;
