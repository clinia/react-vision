import { connectPerPage } from '@clinia/react-vizion-core';
import PerPage from '../components/PerPage';

/**
 * The PerPage widget displays a dropdown menu to let the user change the number
 * of displayed hits.
 *
 * If you only want to configure the number of hits per page without
 * displaying a widget, you should use the `<Configure perPage={20} />` widget. See [`<Configure />` documentation](widgets/Configure.html)
 *
 * @name PerPage
 * @kind widget
 * @propType {{value: number, label: string}[]} items - List of available options.
 * @propType {number} defaultRefinement - The number of items selected by default
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-perpage - the root div of the widget
 * @themeKey cvi-perpage-select - the select
 * @themeKey cvi-perpage-option - the select option
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, PerPage, Hits } from '@clinia/react-vizion-dom';
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
 *     <PerPage
 *       defaultRefinement={5}
 *       items={[
 *         { value: 5, label: 'Show 5 hits' },
 *         { value: 10, label: 'Show 10 hits' },
 *       ]}
 *     />
 *     <Hits />
 *   </Vizion>
 * );
 */

export default connectPerPage(PerPage);
