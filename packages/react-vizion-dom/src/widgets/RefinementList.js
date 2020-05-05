import React from 'react';
import { connectRefinementList } from '@clinia/react-vizion-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import RefinementList from '../components/RefinementList';

/**
 * The RefinementList component displays a list that let the end user choose multiple values for a specific facet.
 * @name RefinementList
 * @kind widget
 * @propType {string} property - the name of the property in the record
 * @propType {string} [operator=or] - How to apply the refinements. Possible values: 'or' or 'and'.
 * @propType {boolean} [showMore=false] - true if the component should display a button that will expand the number of items
 * @propType {number} [limit=10] - the minimum number of displayed items
 * @propType {number} [showMoreLimit=20] - the maximum number of displayed items. Only used when showMore is set to `true`
 * @propType {string[]} [defaultRefinement] - the values of the items selected by default
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-refinementlist - the root div of the widget
 * @themeKey cvi-refinementlist--noRefinement - the root div of the widget when there is no refinement
 * @themeKey cvi-refinementlist-searchBox - the search box of the widget. See [the SearchBox documentation](widgets/SearchBox.html#classnames) for the classnames and translation keys of the SearchBox.
 * @themeKey cvi-refinementlist-list - the list of refinement items
 * @themeKey cvi-refinementlist-item - the refinement list item
 * @themeKey cvi-refinementlist-item--selected - the refinement selected list item
 * @themeKey cvi-refinementlist-label - the label of each refinement item
 * @themeKey cvi-refinementlist-checkbox - the checkbox input of each refinement item
 * @themeKey cvi-refinementlist-labelText - the label text of each refinement item
 * @themeKey cvi-refinementlist-count - the count of values for each item
 * @themeKey cvi-refinementlist-noResults - the div displayed when there are no results
 * @themeKey cvi-refinementlist-showMore - the button used to display more categories
 * @themeKey cvi-refinementlist-showMore--disabled - the disabled button used to display more categories
 * @translationkey showMore - The label of the show more button. Accepts one parameters, a boolean that is true if the values are expanded
 * @translationkey noResults - The label of the no results text when no search for facet values results are found.
 *
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, RefinementList } from '@clinia/react-vizion-dom';
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
 *     <RefinementList attribute="brand" />
 *   </Vizion>
 * );
 */

const RefinementListWidget = props => (
  <PanelCallbackHandler {...props}>
    <RefinementList {...props} />
  </PanelCallbackHandler>
);

export default connectRefinementList(RefinementListWidget);
