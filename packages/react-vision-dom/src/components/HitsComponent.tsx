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
  noResultsFound: React.ReactNode;
  hit: (result: SearchResult) => React.ReactNode;
};

const HitsComponent: React.FunctionComponent<Props> = ({
  results,
  className,
  style,
  hit,
  noResultsFound,
}) => {
  return Array.isArray(results) && results.length > 0 ? (
    <div className={className} style={style}>
      {results.map(searchResult => {
        hit ? (
          hit(searchResult)
        ) : (
          <DefaultHitComponent searchResult={searchResult} />
        );
      })}
    </div>
  ) : (
    <>
      {noResultsFound || <div className="hit-no-results-found-component"></div>}
    </>
  );
};

export default HitsComponent;
