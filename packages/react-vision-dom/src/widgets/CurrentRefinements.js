import React from 'react';
import { connectCurrentRefinements } from '@clinia/react-vision-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import CurrentRefinements from '../components/CurrentRefinements';

/**
 * The CurrentRefinements widget displays the list of currently applied filters.
 *
 * It allows the user to selectively remove them.
 * @name CurrentRefinements
 * @kind widget
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-CurrentRefinements - the root div of the widget
 * @themeKey cvi-CurrentRefinements--noRefinement - the root div of the widget when there is no refinement
 * @themeKey cvi-CurrentRefinements-list - the list of all refined items
 * @themeKey cvi-CurrentRefinements-list--noRefinement - the list of all refined items when there is no refinement
 * @themeKey cvi-CurrentRefinements-item - the refined list item
 * @themeKey cvi-CurrentRefinements-button - the button of each refined list item
 * @themeKey cvi-CurrentRefinements-label - the refined list label
 * @themeKey cvi-CurrentRefinements-category - the category of each item
 * @themeKey cvi-CurrentRefinements-categoryLabel - the label of each catgory
 * @themeKey cvi-CurrentRefinements-delete - the delete button of each label
 * @translationKey clearFilter - the remove filter button label
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, CurrentRefinements, RefinementList } from '@clinia/react-vision-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <CurrentRefinements />
 *     <RefinementList
 *       property="type"
 *       defaultRefinement={['Pharmacy']}
 *     />
 *   </Vision>
 * );
 */

const CurrentRefinementsWidget = props => (
  <PanelCallbackHandler {...props}>
    <CurrentRefinements {...props} />
  </PanelCallbackHandler>
);

export default connectCurrentRefinements(CurrentRefinementsWidget);
