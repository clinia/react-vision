import { connectStats } from '@clinia/react-vizion-core';
import Stats from '../components/Stats';

/**
 * The Stats component displays the total number of matching hits and the time it took to get them (time spent in the Clinia server).
 * @name Stats
 * @kind widget
 * @themeKey cvi-stats - the root div of the widget
 * @themeKey cvi-stats-text - the text of the widget - the count of items for each item
 * @translationkey stats - The string displayed by the stats widget. You get function(n, ms) and you need to return a string. n is a number of hits retrieved, ms is a processed time.
 * @example
 * import React from 'react';
 * import { Vizion, Stats, Hits } from '@clinia/react-vizion-dom';
 * import clinia from 'clinia/lite';
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
 *     <Stats />
 *     <Hits />
 *   </Vizion>
 * );
 */

export default connectStats(Stats);
