import React from 'react';
import { connectCurrentRefinements } from '@clinia/react-vizion-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import CurrentRefinements from '../components/CurrentRefinements';

/**
 * The CurrentRefinements widget displays the list of currently applied filters.
 *
 * It allows the user to selectively remove them.
 * @name CurrentRefinements
 * @kind widget
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-currentrefinements - the root div of the widget
 * @themeKey cvi-currentrefinements--noRefinement - the root div of the widget when there is no refinement
 * @themeKey cvi-currentrefinements-list - the list of all refined items
 * @themeKey cvi-currentrefinements-list--noRefinement - the list of all refined items when there is no refinement
 * @themeKey cvi-currentrefinements-item - the refined list item
 * @themeKey cvi-currentrefinements-button - the button of each refined list item
 * @themeKey cvi-currentrefinements-label - the refined list label
 * @themeKey cvi-currentrefinements-category - the category of each item
 * @themeKey cvi-currentrefinements-categoryLabel - the label of each catgory
 * @themeKey cvi-currentrefinements-delete - the delete button of each label
 * @translationKey clearFilter - the remove filter button label
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, CurrentRefinements, RefinementList } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <CurrentRefinements />
 *     <RefinementList
 *       property="type"
 *       defaultRefinement={['Pharmacy']}
 *     />
 *   </Vizion>
 * );
 */

const CurrentRefinementsWidget = props => (
  <PanelCallbackHandler {...props}>
    <CurrentRefinements {...props} />
  </PanelCallbackHandler>
);

export default connectCurrentRefinements(CurrentRefinementsWidget);
