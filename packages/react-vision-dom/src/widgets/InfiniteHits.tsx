import { connectInfiniteHits } from 'react-vision-core';
import InfiniteHits from '../components/InfiniteHits';

/**
 * Displays an infinite list of hits along with a **load more** button.
 *
 * @name InfiniteHits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each record from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   record in its JSON form. The component will be called with a `record` prop.
 * @themeKey cvi-InfiniteHits - the root div of the widget
 * @themeKey cvi-InfiniteHits-list - the list of hits
 * @themeKey cvi-InfiniteHits-item - the hit list item
 * @themeKey cvi-InfiniteHits-loadMore - the button used to display more results
 * @themeKey cvi-InfiniteHits-loadMore--disabled - the disabled button used to display more results
 * @translationKey loadMore - the label of load more button
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
