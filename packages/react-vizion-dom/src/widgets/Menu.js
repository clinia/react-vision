import React from 'react';
import { connectMenu } from '@clinia/react-vizion-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import Menu from '../components/Menu';

/**
 * The Menu component displays a menu that lets the user choose a single value for a specific property.
 * @name Menu
 * @kind widget
 * @requirements The property passed to the `property` prop must be facetable & filterable
 * @propType {string} property - the name of the property in the record
 * @propType {boolean} [showMore=false] - true if the component should display a button that will expand the number of items
 * @propType {number} [limit=10] - the minimum number of diplayed items
 * @propType {number} [showMoreLimit=20] - the maximun number of displayed items. Only used when showMore is set to `true`
 * @propType {string} [defaultRefinement] - the value of the item selected by default
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-menu - the root div of the widget
 * @themeKey cvi-menu-list - the list of all menu items
 * @themeKey cvi-menu-item - the menu list item
 * @themeKey cvi-menu-item--selected - the selected menu list item
 * @themeKey cvi-menu-link - the clickable menu element
 * @themeKey cvi-menu-label - the label of each item
 * @themeKey cvi-menu-count - the count of values for each item
 * @themeKey cvi-menu-noResults - the div displayed when there are no results
 * @themeKey cvi-menu-showMore - the button used to display more categories
 * @themeKey cvi-menu-showMore--disabled - the disabled button used to display more categories
 * @translationkey showMore - The label of the show more button. Accepts one parameters, a boolean that is true if the values are expanded
 * @translationkey noResults - The label of the no results text when no search for facet values results are found.
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, Menu } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <Menu property="services" />
 *   </Vizion>
 * );
 */

const MenuWidget = props => (
  <PanelCallbackHandler {...props}>
    <Menu {...props} />
  </PanelCallbackHandler>
);

export default connectMenu(MenuWidget);
