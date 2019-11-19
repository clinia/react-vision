import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';
import { addAbsolutePositions } from '../core/utils';

/**
 * connectHits connector provides the logic to create connected
 * components that will render the results retrieved from
 * Clinia.
 *
 * **Warning:** you will need to use the **id** property available on every hit as a key
 * when iterating over them. This will ensure you have the best possible UI experience
 * especially on slow networks.
 * @name connectHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, Highlight, connectHits } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *   'TODO',
 *   'test'
 * );
 * const CustomHits = connectHits(({ records }) => (
 *   <div>
 *     {records.map(record =>
 *       <p key={record.id}>
 *         {record.name}
 *       </p>
 *     )}
 *   </div>
 * ));
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <CustomHits />
 *   </Vision>
 * );
 */
export default createConnector({
  displayName: 'CliniaHits',

  getProvidedProps(props, searchState, searchResults) {
    const results = getResults(searchResults, {
      cvi: props.contextValue,
      multiIndexContext: props.indexContextValue,
    });

    if (!results) {
      return { records: [] };
    }
    const recordsWithPositions = addAbsolutePositions(
      results.records,
      results.perPage,
      results.page
    );

    return {
      records: recordsWithPositions,
      loading: searchResults.searching,
    };
  },

  /**
   * Hits needs to be considered as a widget to trigger a search,
   * even if no other widgets are used.
   *
   * To be considered as a widget you need either:
   * - getSearchParameters
   * - getMetadata
   * - transitionState
   *
   * See: createConnector.tsx
   */
  getSearchParameters(searchParameters) {
    return searchParameters;
  },
});
