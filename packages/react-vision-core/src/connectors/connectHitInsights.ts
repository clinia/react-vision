import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';

type Results = { index: string };
type Hit = { id: string; __position: number; __queryID: string };

type InsightsClient = (
  method: InsightsClientMethod,
  payload: InsightsClientPayload
) => void;

type InsightsClientMethod =
  | 'clickedRecordIDsAfterSearch'
  | 'convertedRecordIDsAfterSearch';

type InsightsClientPayload = {
  index: string;
  queryID: string;
  eventName: string;
  recordIDs: string[];
  positions?: number[];
};

function inferPayload({
  method,
  results,
  currentHit,
}: {
  method: InsightsClientMethod;
  results: Results;
  currentHit: Hit;
}): Omit<InsightsClientPayload, 'eventName'> {
  const { index } = results;
  const queryID = currentHit.__queryID;
  const recordIDs = [currentHit.id];

  if (!queryID) {
    throw new Error(
      `Could not infer \`queryID\`. Ensure \`clickAnalytics: true\` was added with the Configure widget.`
    );
  }

  switch (method) {
    case 'clickedRecordIDsAfterSearch': {
      const positions = [currentHit.__position];
      return { index, queryID, recordIDs, positions };
    }

    case 'convertedRecordIDsAfterSearch':
      return { index, queryID, recordIDs };

    default:
      throw new Error(
        `Unsupported method "${method}" passed to the insights function. The supported methods are: "clickedRecordIDsAfterSearch", "convertedRecordIDsAfterSearch".`
      );
  }
}

const wrapInsightsClient = (
  ca: InsightsClient,
  results: Results,
  currentHit: Hit
) => (
  method: InsightsClientMethod,
  payload: Partial<InsightsClientPayload>
) => {
  if (typeof ca !== 'function') {
    throw new TypeError(`Expected insightsClient to be a Function`);
  }
  const inferredPayload = inferPayload({ method, results, currentHit });
  ca(method, { ...inferredPayload, ...payload } as any);
};

export default (insightsClient: InsightsClient) =>
  createConnector({
    displayName: 'CliniaInsights',

    getProvidedProps(props, _, searchResults) {
      const results: Results = getResults(searchResults, {
        cvi: props.contextValue,
        multiIndexContext: props.indexContextValue,
      });

      const insights = wrapInsightsClient(insightsClient, results, props.hit);
      return { insights };
    },
  });
