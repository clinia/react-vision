import connectConfigure from '../connectors/connectConfigure';

/**
 * Configure is a widget that lets you provide raw search parameters
 * to the Clinia API.
 *
 * This widget can be used either with react-dom and react-native. It will not render anything
 * on screen, only configure some parameters.
 *
 * @name Configure
 * @kind widget
 * @example
 * import React from 'react';
 * import cliniasearch from 'cliniasearch/lite';
 * import { Vision, Configure, Hits } from 'react-vision-dom';
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
 *     <Configure perPage={5} queryType="prefix_last" />
 *     <Hits />
 *   </Vision>
 * );
 */

export default connectConfigure(function Configure() {
  return null;
});
