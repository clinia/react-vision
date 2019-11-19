import { connectAutoComplete } from 'react-vision-core';
import AutoComplete from '../components/AutoComplete';

/**
 * The AutoComplete component displays a search box that lets the user search for a specific speciality.
 * @name AutoComplete
 * @kind widget
 * @propType {function} [renderSuggestion] - Define how suggestions will be rendered
 * @propType {function} [onSuggestionSelected] - Executes every time that a suggestion is selected
 * @propType {boolean} [triggerSubmitOnSuggestionSelected=false] - Define if the AutoComplete form container should be submitted onSuggestionSelected
 * @propType {function} [onSubmit] - Intercept submit event sent from the AutoComplete form container.
 * @propType {function} [onClear] - Listen to `reset` event sent from the AutoComplete form container.
 * @propType {function} [on*] - Listen to any events sent from the search input itself.
 * @propType {node} [clear] - Change the apparence of the default reset button (cross).
 * @propType {node} [loadingIndicator] - Change the apparence of the default loading indicator (spinning circle).
 * @propType {node} [submit] - Change the apparence of the default submit button (magnifying glass).
 * @propType {string} [defaultRefinement] - Provide default refinement value when component is mounted.
 * @propType {boolean} [showLoadingIndicator=false] - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @propType {boolean} [autoFocus=false] - Set autoFocus to the autocomplete input
 * @propType {string} [className] - Add a custom CSS class to the AutoComplete form container
 * @propType {object} [style] - Add a custom React.CSSProperties object to the AutoComplete form container
 * @themeKey cvi-AutoComplete - the root div of the widget
 * @themeKey cvi-AutoComplete-form - the wrapping form
 * @themeKey cvi-AutoComplete-input - the search input
 * @themeKey cvi-AutoComplete-submit - the submit button
 * @themeKey cvi-AutoComplete-submitIcon - the default magnifier icon used with the search input
 * @themeKey cvi-AutoComplete-clear - the reset button used to clear the content of the input
 * @themeKey cvi-AutoComplete-clearIcon - the default reset icon used inside the reset button
 * @themeKey cvi-AutoComplete-loadingIndicator - the loading indicator container
 * @themeKey cvi-AutoComplete-loadingIcon - the default loading icon
 * @translationkey searchTitle - The submit button title
 * @translationkey clearTitle - The reset button title
 * @translationkey placeholder - The label of the input placeholder
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

export default connectAutoComplete(AutoComplete);
