import React from 'react';
import { connectLocation } from 'react-vision-core';
import AutoComplete from '../components/AutoComplete';

/**
 * The Location component displays a search box that lets the user search for a specific query.
 * @name Location
 * @kind widget
 * @propType {boolean} [autoFocus=false] - Should the search box be focused on render?
 * @propType {function} [onSubmit] - Intercept submit event sent from the Location form container.
 * @propType {function} [onClear] - Listen to `reset` event sent from the Location form container.
 * @propType {function} [on*] - Listen to any events sent from the search input itself.
 * @propType {node} [submit] - Change the apparence of the default submit button (magnifying glass).
 * @propType {node} [clear] - Change the apparence of the default reset button (cross).
 * @propType {node} [loadingIndicator] - Change the apparence of the default loading indicator (spinning circle).
 * @propType {string} [defaultRefinement] - Provide default refinement value when component is mounted.
 * @propType {boolean} [showLoadingIndicator=false] - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @themeKey cvi-Location - the root div of the widget
 * @themeKey cvi-Location-form - the wrapping form
 * @themeKey cvi-Location-input - the search input
 * @themeKey cvi-Location-submit - the submit button
 * @themeKey cvi-Location-submitIcon - the default magnifier icon used with the search input
 * @themeKey cvi-Location-clear - the reset button used to clear the content of the input
 * @themeKey cvi-Location-clearIcon - the default reset icon used inside the reset button
 * @themeKey cvi-Location-loadingIndicator - the loading indicator container
 * @themeKey cvi-Location-loadingIcon - the default loading icon
 * @translationkey searchTitle - The submit button title
 * @translationkey clearTitle - The reset button title
 * @translationkey placeholder - The label of the input placeholder
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, Location } from 'react-vision-dom';
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
 *     <Location />
 *   </Vision>
 * );
 */

const Location = props => {
  let locationSuggestions = props.suggestions.map(s => ({
    suggestion: s.formattedAddress,
  }));

  return (
    <AutoComplete
      {...props}
      searchForSuggestions={props.searchForLocations}
      suggestions={locationSuggestions}
      customThemeKey="Location"
    />
  );
};

export default connectLocation(Location);
