import { SearchResult } from './HitsComponent';

type Props = {
  searchResult: SearchResult;
};

const DefaultHitComponent: React.FunctionComponent<Props> = ({
  searchResult,
}) => {
  return (
    <div className="default-hit-card">
      <div className="default-hit-container">
        <h4 className="default-hit-title">{searchResult.resourceName}</h4>
        <div className="card-body">{JSON.stringify(searchResult, null, 2)}</div>
      </div>
    </div>
  );
};

export default DefaultHitComponent;
