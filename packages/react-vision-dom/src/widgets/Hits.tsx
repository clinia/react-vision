import { connectHits } from 'react-vision-core';
import Hits from '../components/Hits';

/**
 * Displays a list of hits.
 *
 * @name Hits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `record` prop.
 * @propType {node} [noResultsFound] - Change the apparence of the default empty results found.
 * @propType {string} [className] - Add a custom CSS class to the component
 * @propType {object} [style] - Add a custom React.CSSProperties object to the Hits container
 * @themeKey cvi-Hits - the root div of the widget
 * @themeKey cvi-Hits-list - the list of results
 * @themeKey cvi-Hits-item - the hit list item
 * @translationkey emptySearch - The text shown on empty results
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, Hits } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *   'TODO',
 *   'test'
 * );
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <Hits />
 *   </Vision>
 * );
 */

export default connectHits(Hits);
