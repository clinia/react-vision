import React from 'react';
import classnames from 'classnames';
import { createClassNames } from '../core/utils';
import { translatable } from 'react-vision-core';

export type SearchResult = {
  id: string;
};

type HitProps = {
  results: SearchResult[];
  className?: string;
  style?: React.CSSProperties;
  noResultsFound?: React.ReactNode;
  hit?: (result: SearchResult) => React.ReactNode;
  onClick?: (event?: React.MouseEvent) => void;
  translate: any;
};

type DefaultHitProps = {
  searchResult: SearchResult;
};

const DefaultHit: React.FunctionComponent<DefaultHitProps> = ({
  searchResult,
}) => {
  return (
    <div className="default-hit-card">
      <div className="default-hit-container">
        <h4 className="default-hit-title">{searchResult.id}</h4>
        <div className="card-body">{JSON.stringify(searchResult, null, 2)}</div>
      </div>
    </div>
  );
};

const cx = createClassNames('Hits');

const Hits: React.FunctionComponent<HitProps> = ({
  results,
  className,
  style,
  hit,
  noResultsFound,
  onClick,
  translate,
}) => {
  return (
    <div className={classnames(cx('hits'), className)} style={style}>
      <div className={cx('hits-list')}>
        {Array.isArray(results) && results.length > 0
          ? results.map(searchResult => (
              <div key={searchResult.id} onClick={onClick}>
                {hit ? (
                  hit(searchResult)
                ) : (
                  <DefaultHit searchResult={searchResult} />
                )}
              </div>
            ))
          : noResultsFound || (
              //Temporarily until we have the styles decided
              <div className={cx('empty')}>{translate('emptySearch')}</div>
            )}
      </div>
    </div>
  );
};

export default translatable({
  emptySearch: 'No results were found',
})(Hits);
