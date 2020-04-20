import connectConfigure from '../connectors/connectConfigure';

/**
 * @module Configure
 */

/**
 * Configure is a widget that lets you provide raw search parameters
 * to the Clinia API.
 *
 * This widget can be used either with react-dom and react-native. It will not render anything
 * on screen, only configure some parameters.
 * @alias module:Configure
 * @kind widget
 * @prop {string} queryType=prefix_none - Sets the matching strategy for the search. Value is either `prefix_none` for complete word matching or `prefix_last` for partial word matching.
 * @prop {perPage} perPage - Sets the number of search results to return per page.
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vizion, Configure, Hits } from '@clinia/react-vizion-dom';
 *
 * const searchClient = cliniasearch(
 *   'TODO',
 *   'test'
 * );
 *
 * const App = () => (
 *   <Vizion
 *     searchClient={searchClient}
 *     indexName="health_facility"
 *   >
 *     <Configure perPage={5} queryType="prefix_last" />
 *     <Hits />
 *   </Vizion>
 * );
 */
export default connectConfigure(function Configure() {
  return null;
});
