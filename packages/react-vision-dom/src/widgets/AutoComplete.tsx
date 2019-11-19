import { connectAutoComplete } from 'react-vision-core';
import AutoComplete from '../components/AutoComplete';

/** 
 * @module Autocomplete
 */

/**
 * The AutoComplete component displays a search box that lets the user search for a specific query.
 * @alias module:Autocomplete
 * @kind widget
 * @prop {function} renderSuggestion - Define how suggestions will be rendered
 * @prop {function} onSuggestionSelected - Executes every time that a suggestion is selected
 * @prop {boolean} triggerSubmitOnSuggestionSelected=false - Define if the AutoComplete form container should be submitted onSuggestionSelected
 * @prop {function} onSubmit - Intercept submit event sent from the AutoComplete form container.
 * @prop {function} onClear - Listen to `reset` event sent from the AutoComplete form container.
 * @prop {function} on* - Listen to any events sent from the search input itself.
 * @prop {node} clear - Change the apparence of the default reset button (cross).
 * @prop {node} loadingIndicator - Change the apparence of the default loading indicator (spinning circle).
 * @prop {node} submit - Change the apparence of the default submit button (magnifying glass).
 * @prop {string} defaultRefinement - Provide default refinement value when component is mounted.
 * @prop {boolean} showLoadingIndicator=false - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @prop {boolean} autoFocus=false - Set autoFocus to the autocomplete input
 * @prop {string} className - Add a custom CSS class to the AutoComplete form container
 * @prop {object} style - Add a custom React.CSSProperties object to the AutoComplete form container
 * @prop {string} searchTitle - The submit button title
 * @prop {string} clearTitle - The reset button title
 * @prop {string} placeholder - The label of the input placeholder
 * @themekey cvi-AutoComplete - The root div of the widget
 * @themekey cvi-AutoComplete-form - The wrapping form
 * @themekey cvi-AutoComplete-input - The search input
 * @themekey cvi-AutoComplete-submit - The submit button
 * @themekey cvi-AutoComplete-submitIcon - The default magnifier icon used with the search input
 * @themekey cvi-AutoComplete-clear - The reset button used to clear the content of the input
 * @themekey cvi-AutoComplete-clearIcon - The default reset icon used inside the reset button
 * @themekey cvi-AutoComplete-loadingIndicator - The loading indicator container
 * @themekey cvi-AutoComplete-loadingIcon - The default loading icon
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, AutoComplete } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *   >
 *     <AutoComplete />
 *   </Vision>
 * );
 */
export default connectAutoComplete(AutoComplete)
