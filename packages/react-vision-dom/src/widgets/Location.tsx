import React from 'react';
import { connectLocation } from 'react-vision-core';
import AutoComplete from '../components/AutoComplete';

/**
 * @module Location
 */

/**
 * The Location component displays a search box that lets the user search for a specific location.
 * @alias module:Location
 * @kind widget
 * @prop {string[]} country=['CA'] - Filter the suggestion to the given country codes. (The countries values must be formatted according to the ISO 3166, e.g. "CA")
 * @prop {string} locale='en' - Define the language for the presented suggestions (The locale value must be formatted according to the ISO 639, e.g. 'en')
 * @prop {number} limit=5 - Define the limit number for the presented suggestions
 * @prop {function} renderSuggestion - Define how suggestions will be rendered
 * @prop {function} onSuggestionSelected - Executes every time that a suggestion is selected
 * @prop {boolean} triggerSubmitOnSuggestionSelected=false - Define if the Location form container should be submitted onSuggestionSelected
 * @prop {function} onSubmit - Intercept submit event sent from the Location form container.
 * @prop {function} onClear - Listen to `reset` event sent from the Location form container.
 * @prop {function} on* - Listen to any events sent from the search input itself.
 * @prop {node} clear - Change the apparence of the default reset button (cross).
 * @prop {node} loadingIndicator - Change the apparence of the default loading indicator (spinning circle).
 * @prop {node} submit - Change the apparence of the default submit button (magnifying glass).
 * @prop {string} defaultRefinement - Provide default refinement value when component is mounted.
 * @prop {boolean} showLoadingIndicator=false - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @prop {boolean} autoFocus=false - Set autoFocus to the autocomplete input
 * @prop {string} className - Add a custom CSS class to the Location form container
 * @prop {object} style - Add a custom React.CSSProperties object to the Location form container
 * @prop {string} searchTitle - The submit button title
 * @prop {string} clearTitle - The reset button title
 * @prop {string} placeholder - The label of the input placeholder
 * @themekey cvi-Location - the root div of the widget
 * @themekey cvi-Location-form - the wrapping form
 * @themekey cvi-Location-input - the search input
 * @themekey cvi-Location-submit - the submit button
 * @themekey cvi-Location-submitIcon - the default magnifier icon used with the search input
 * @themekey cvi-Location-clear - the reset button used to clear the content of the input
 * @themekey cvi-Location-clearIcon - the default reset icon used inside the reset button
 * @themekey cvi-Location-loadingIndicator - the loading indicator container
 * @themekey cvi-Location-loadingIcon - the default loading icon
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
