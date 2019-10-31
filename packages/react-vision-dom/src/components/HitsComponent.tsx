import React from 'react';
import DefaultHitComponent from './DefaultHitComponent';

export type SearchResult = {
  resourceId: string;
  address: any;
  distance: number;
  geoPoint: {
    lat: number;
    lng: number;
  };
  resourceName: string;
  note: string;
  onlineBookingUrl: string;
  phones: any;
  type: string;
};

type Props = {
  results: SearchResult[];
  className?: string;
  style?: React.CSSProperties;
  noResultsFound?: React.ReactNode;
  hit?: (result: SearchResult) => React.ReactNode;
};

const HitsComponent: React.FunctionComponent<Props> = ({
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
          <div key={searchResult.resourceId}>
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
