import { connectSearchBox } from '@clinia/react-vision-core';
import SearchBox from '../components/SearchBox';

/**
 * @module SearchBox
 */

/**
 * The SearchBox component displays a search box that lets the user search for a specific query.
 * @alias module:SearchBox
 * @kind widget
 * @prop {boolean} autoFocus=false - Should the search box be focused on render?
 * @prop {string} className - Add a custom CSS class to the SearchBox form container.
 * @prop {node} clear - Change the apparence of the default reset button (cross).
 * @prop {string} clearTitle - The reset button title.
 * @prop {string} defaultRefinement - Provide default refinement value when component is mounted.
 * @prop {string[]} focusShortcuts=['s','/'] - List of keyboard shortcuts that focus the search box. Accepts key names and key codes.
 * @prop {node} loadingIndicator - Change the apparence of the default loading indicator (spinning circle).
 * @prop {function} onClear - Listen to `reset` event sent from the SearchBox form container.
 * @prop {function} onSubmit - Intercept submit event sent from the SearchBox form container.
 * @prop {function} on* - Listen to any events sent from the search input itself.
 * @prop {string} placeholder - The label of the input placeholder.
 * @prop {boolean} searchAsYouType=true - Should we search on every change to the query? If you disable this option, new searches will only be triggered by clicking the search button or by pressing the enter key while the search box is focused.
 * @prop {string} searchTitle - The submit button title.
 * @prop {boolean} showLoadingIndicator=false - Display that the search is loading. This only happens after a certain amount of time to avoid a blinking effect. This timer can be configured with `stalledSearchDelay` props on <InstantSearch>. By default, the value is 200ms.
 * @prop {object} style - Add a custom React.CSSProperties object to SearchBox form container.
 * @prop {node} submit - Change the apparence of the default submit button (magnifying glass).
 * @themekey cvi-searchbox - The root div of the widget.
 * @themekey cvi-searchbox-clear - The reset button used to clear the content of the input.
 * @themekey cvi-searchbox-clearicon - The default reset icon used inside the reset button.
 * @themekey cvi-searchbox-form - The wrapping form.
 * @themekey cvi-searchbox-input - The search input.
 * @themekey cvi-searchbox-loadingindicator - The loading indicator container.
 * @themekey cvi-searchbox-loadingicon - The default loading icon.
 * @themekey cvi-searchbox-submit - The submit button.
 * @themekey cvi-searchbox-submiticon - The default magnifier icon used with the search input.
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, SearchBox } from '@clinia/react-vision-dom';
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
 *     <SearchBox />
 *   </Vision>
 * );
 */

export default connectSearchBox(SearchBox);
