import React from 'react';

export type SearchResult = {
  id: string;
};

type HitComponentProps = {
  results: SearchResult[];
  className?: string;
  style?: React.CSSProperties;
  noResultsFound?: React.ReactNode;
  hit?: (result: SearchResult) => React.ReactNode;
};

type DefaultHitComponentProps = {
  searchResult: SearchResult;
};

const DefaultHitComponent: React.FunctionComponent<
  DefaultHitComponentProps
> = ({ searchResult }) => {
  return (
    <div className="default-hit-card">
      <div className="default-hit-container">
        <h4 className="default-hit-title">{searchResult.id}</h4>
        <div className="card-body">{JSON.stringify(searchResult, null, 2)}</div>
      </div>
    </div>
  );
};

const HitsComponent: React.FunctionComponent<HitComponentProps> = ({
  results,
  className,
  style,
  hit,
  noResultsFound,
}) => {
  return (
    <div className={className} style={style}>
      {Array.isArray(results) && results.length > 0 ? (
        results.map(searchResult => (
          <div key={searchResult.id}>
            {hit ? (
              hit(searchResult)
            ) : (
              <>
                <DefaultHitComponent searchResult={searchResult} />
              </>
            )}
          </div>
        ))
      ) : (
        <>
          {noResultsFound || (
            <div className="default-hit-no-results-found"></div>
          )}
        </>
      )}
      ;
    </div>
  );
};

export default HitsComponent;
