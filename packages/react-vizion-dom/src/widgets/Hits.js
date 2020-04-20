import { connectHits } from '@clinia/react-vizion-core';
import Hits from '../components/Hits';

/**
 * Displays a list of hits.
 *
 * To configure the number of hits being shown, use the [PerPage widget](widgets/PerPage.html),
 * [connectPerPage connector](connectors/connectPerPage.html) or the [Configure widget](widgets/Configure.html).
 *
 * @name Hits
 * @kind widget
 * @propType {Component} [hitComponent] - Component used for rendering each hit from
 *   the results. If it is not provided the rendering defaults to displaying the
 *   hit in its JSON form. The component will be called with a `hit` prop.
 * @themeKey cvi-hits - the root div of the widget
 * @themeKey cvi-hits-list - the list of results
 * @themeKey cvi-hits-item - the hit list item
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, Hits } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <Hits />
 *   </Vizion>
 * );
 */

export default connectHits(Hits);
