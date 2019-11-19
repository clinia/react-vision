import { connectInfiniteHits } from 'react-vision-core';
import InfiniteHits from '../components/InfiniteHits';
/**
 * @module InfiniteHits 
 */

/**
 * Displays an infinite list of hits along with a **load more** button.
 * @alias module:InfiniteHits
 * @kind widget
 * @prop {Component} hitComponent - Component used for rendering each record from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   record in its JSON form. The component will be called with a `record` prop.
 * @prop {boolean} showPrevious=false - Define if button of `load previous` should be shown
 * @prop {string} className - Add a custom CSS class to the component
 * @prop loadMore - The label of load more button
 * @prop loadPrevious - The label of load previous button
 * @themekey cvi-InfiniteHits - The root div of the widget
 * @themekey cvi-InfiniteHits-list - The list of hits
 * @themekey cvi-InfiniteHits-item - The hit list item
 * @themekey cvi-InfiniteHits-loadMore - The button used to display more results
 * @themekey cvi-InfiniteHits-loadMore--disabled - The disabled button used to display more results
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, InfiniteHits } from 'react-vision-dom';
 *
 * const searchClient = cliniasearch(
 *   'TODO',
 *   'test'
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <InfiniteHits />
 *   </Vision>
 * );
 */

export default connectInfiniteHits(InfiniteHits);
