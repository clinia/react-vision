import React from 'react';
import { connectMenu } from '@clinia/react-vizion-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import MenuSelect from '../components/MenuSelect';

/**
 * The MenuSelect component displays a select that lets the user choose a single value for a specific property.
 * @name MenuSelect
 * @kind widget
 * @requirements The property passed to the `property` prop must be facetable and filterable
 * @propType {string} property - the name of the property in the record
 * @propType {string} [defaultRefinement] - the value of the item selected by default
 * @propType {number} [limit=10] - the minimum number of diplayed items
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-menuselect - the root div of the widget
 * @themeKey cvi-menuselect-noRefinement - the root div of the widget when there is no refinement
 * @themeKey cvi-menuselect-select - the `<select>`
 * @themeKey cvi-menuselect-option - the select `<option>`
 * @translationkey seeAllOption - The label of the option to select to remove the refinement
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, MenuSelect } from '@clinia/react-vizion-dom';
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
 *     <MenuSelect property="categories" />
 *   </Vizion>
 * );
 */

const MenuSelectWidget = props => (
  <PanelCallbackHandler {...props}>
    <MenuSelect {...props} />
  </PanelCallbackHandler>
);

export default connectMenu(MenuSelectWidget);
