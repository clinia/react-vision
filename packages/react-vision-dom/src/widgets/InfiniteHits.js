import { connectInfiniteHits } from '@clinia/react-vision-core';
import InfiniteHits from '../components/InfiniteHits';

/**
 * Displays an infinite list of hits along with a **load more** button.
 *
 * To configure the number of hits being shown, use the [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or the [Configure widget](widgets/Configure.html).
 *
 * @name InfiniteHits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `hit` prop.
 * @themeKey cvi-InfiniteHits - the root div of the widget
 * @themeKey cvi-InfiniteHits-list - the list of hits
 * @themeKey cvi-InfiniteHits-item - the hit list item
 * @themeKey cvi-InfiniteHits-loadMore - the button used to display more results
 * @themeKey cvi-InfiniteHits-loadMore--disabled - the disabled button used to display more results
 * @translationKey loadMore - the label of load more button
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, InfiniteHits } from '@clinia/react-vision-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <InfiniteHits />
 *   </Vision>
 * );
 */

export default connectInfiniteHits(InfiniteHits);
