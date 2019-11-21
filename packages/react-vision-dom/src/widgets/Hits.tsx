import { connectHits } from 'react-vision-core';
import Hits from '../components/Hits';

/**
 * Displays a list of hits.
 * @module Hits
 * @kind widget
 * @prop {string} className - Add a custom CSS class to the component.
 * @prop {string} emptySearch - The text shown on empty results.
 * @prop {Component} hitComponent - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `record` prop.
 * @prop {node} noResultsFound - Change the apparence of the default empty results found.
 * @prop {object} style - Add a custom React.CSSProperties object to the Hits container.
 * @themekey cvi-Hits - The root div of the widget.
 * @themekey cvi-Hits-item - The hit list item
 * @themekey cvi-Hits-list - The list of results.
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
