import React from 'react';
import PropTypes from 'prop-types';
import { connectLocation } from 'react-vision-core';
import AutoComplete from '../components/AutoComplete';
import ExecutionEnvironment from 'exenv';

/**
 * @module Location
 */

/**
 * The Location component displays a search box that lets the user search for a specific location.
 * @alias module:Location
 * @kind widget
 * @prop {boolean} autoFocus=false - Set autoFocus to the autocomplete input
 * @prop {string} className - Add a custom CSS class to the Location form container
 * @prop {node} clear - Change the apparence of the default reset button (cross).
 * @prop {boolean} hideClear - hide clear button
 * @prop {string} clearTitle - The reset button title
 * @prop {string} country - Filter the suggestion to the given country codes. (The countries values must be formatted according to the ISO 3166, e.g. "CA").
 * @prop {string} defaultRefinement - Provide default refinement value when component is mounted.
 * @prop {boolean} enableUserLocation - Append to suggestions user location. If this option is enabled, a new suggestion with { type: 'user' } can be handled in `renderSuggestion`
 * @prop {function} onUserPositionError - Execute when an error occur while fetching user position
 * @prop {number} limit=5 - Define the limit number for the presented suggestions.
 * @prop {node} loadingIndicator - Change the apparence of the default loading indicator (spinning circle).
 * @prop {string} locale=en - Define the language for the presented suggestions (The locale value must be formatted according to the ISO 639, e.g. 'en').
 * @prop {function} onClear - Listen to `reset` event sent from the Location form container.
 * @prop {function} onSubmit - Intercept submit event sent from the Location form container.
 * @prop {function} onSuggestionSelected - Executes every time that a suggestion is selected.
 * @prop {function} on* - Listen to any events sent from the search input itself.
 * @prop {object} translations - translations for: { placeholder, searchTitle, clearTitle, userPosition }
 * @prop {function} renderSuggestion - Define how suggestions will be rendered.
 * @prop {string} searchTitle - The submit button title
 * @prop {boolean} showLoadingIndicator=false - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @prop {object} style - Add a custom React.CSSProperties object to the Location form container
 * @prop {node} submit - Change the apparence of the default submit button (magnifying glass).
 * @prop {boolean} triggerSubmitOnSuggestionSelected=false - Define if the Location form container should be submitted onSuggestionSelected
 * @themekey cvi-location - The root div of the widget.
 * @themekey cvi-location-clear - The reset button used to clear the content of the input.
 * @themekey cvi-location-clearicon - The default reset icon used inside the reset button.
 * @themekey cvi-location-form - The wrapping form.
 * @themekey cvi-location-input - The search input.
 * @themekey cvi-location-loadingicon - The default loading icon.
 * @themekey cvi-location-loadingindicator - The loading indicator container.
 * @themekey cvi-location-submit - The submit button.
 * @themekey cvi-location-submiticon - The default magnifier icon used with the search input.
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
    ...s, // expose all suggestion properties
    suggestion: s.formattedAddress,
  }));

  if (
    ExecutionEnvironment.canUseDOM &&
    props.enableUserLocation &&
    navigator &&
    navigator.geolocation
  ) {
    locationSuggestions = [
      { type: 'user', suggestion: 'user-position' },
      ...locationSuggestions,
    ];
  }

  return (
    <AutoComplete
      {...props}
      searchForSuggestions={props.searchForLocations}
      suggestions={locationSuggestions}
      customThemeKey="Location"
    />
  );
};

Location.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.object.isRequired),
  searchForLocations: PropTypes.func,
  enableUserLocation: PropTypes.bool,
};

export default connectLocation(Location);
