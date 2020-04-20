import { connectInfiniteHits } from '@clinia/react-vizion-core';
import InfiniteHits from '../components/InfiniteHits';

/**
 * Displays an infinite list of hits along with a **load more** button.
 *
 * To configure the number of hits being shown, use the [PerPage widget](widgets/PerPage.html),
 * [connectPerPage connector](connectors/connectPerPage.html) or the [Configure widget](widgets/Configure.html).
 *
 * @name InfiniteHits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `hit` prop.
 * @themeKey cvi-infinitehits - the root div of the widget
 * @themeKey cvi-infinitehits-list - the list of hits
 * @themeKey cvi-infinitehits-item - the hit list item
 * @themeKey cvi-infinitehits-loadMore - the button used to display more results
 * @themeKey cvi-infinitehits-loadMore--disabled - the disabled button used to display more results
 * @translationKey loadMore - the label of load more button
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, InfiniteHits } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <InfiniteHits />
 *   </Vizion>
 * );
 */

export default connectInfiniteHits(InfiniteHits);
