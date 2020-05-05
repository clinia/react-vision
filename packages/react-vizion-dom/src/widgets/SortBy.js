import { connectSortBy } from '@clinia/react-vizion-core';
import SortBy from '../components/SortBy';

/**
 * The SortBy component displays a list of indexes allowing a user to change the hits are sorting.
 * @name SortBy
 * @kind widget
 * @propType {{value: string, label: string}[]} items - The list of indexes to search in.
 * @propType {string} defaultRefinement - The default selected index.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey cvi-sortby - the root div of the widget
 * @themeKey cvi-sortby-select - the select
 * @themeKey cvi-sortby-option - the select option
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, SortBy } from '@clinia/react-vizion-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="meta"
 *   >
 *     <SortBy
 *       defaultRefinement="score"
 *       items={[
 *         { value: 'score', label: 'Relevance' },
 *         { value: 'asc(updatedAt)', label: 'Last updated asc.' },
 *         { value: 'desc(updatedAt)', label: 'last updated desc.' },
 *       ]}
 *     />
 *   </Vizion>
 * );
 */

export default connectSortBy(SortBy);
