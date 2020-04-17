import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';
import { addAbsolutePositions, addQueryID } from '../core/utils';

/**
 * connectHits connector provides the logic to create connected
 * components that will render the results retrieved from
 * Clinia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * prop to a [Configure](guide/Search_parameters.html) widget.
 *
 * **Warning:** you will need to use the **id** property available on every hit as a key
 * when iterating over them. This will ensure you have the best possible UI experience
 * especially on slow networks.
 * @name connectHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, Highlight, connectHits } from '@clinia/react-vision-dom';
 *
 * const searchClient = clinia(
 *   'TODO',
 *   'test'
 * );
 * const CustomHits = connectHits(({ hits }) => (
 *   <div>
 *     {hits.map(hit =>
 *       <p key={hit.id}>
 *         {hit.name}
 *       </p>
 *     )}
 *   </div>
 * ));
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="pharmacy"
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
      return { hits: [] };
    }
    const hitsWithPositions = addAbsolutePositions(
      results.hits,
      results.perPage,
      results.page
    );
    const hitsWithPositionsAndQueryID = addQueryID(
      hitsWithPositions,
      results.queryID
    );

    return {
      hits: hitsWithPositionsAndQueryID,
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
