import { connectToggleRefinement } from '@clinia/react-vizion-core';
import ToggleRefinement from '../components/ToggleRefinement';

/**
 * The ToggleRefinement provides an on/off filtering feature based on an property value.
 * @name ToggleRefinement
 * @kind widget
 * @requirements To use this widget, you'll need an property to toggle on.
 * @propType {string} property - Name of the property on which to apply the `value` refinement. Required when `value` is present.
 * @propType {string} label - Label for the toggle.
 * @propType {any} value - Value of the refinement to apply on `property` when checked.
 * @propType {boolean} [defaultRefinement=false] - Default state of the widget. Should the toggle be checked by default?
 * @themeKey cvi-togglerefinement - the root div of the widget
 * @themeKey cvi-togglerefinement-list - the list of toggles
 * @themeKey cvi-togglerefinement-item - the toggle list item
 * @themeKey cvi-togglerefinement-label - the label of each toggle item
 * @themeKey cvi-togglerefinement-checkbox - the checkbox input of each toggle item
 * @themeKey cvi-togglerefinement-labelText - the label text of each toggle item
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, ToggleRefinement } from '@clinia/react-vizion-dom';
 *
 * const searchClient = algoliasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <ToggleRefinement
 *       property="free_shipping"
 *       label="Free Shipping"
 *       value={true}
 *     />
 *   </Vizion>
 * );
 */

export default connectToggleRefinement(ToggleRefinement);
