import createConnector from '../core/createConnector';
import { HIGHLIGHT_TAGS, parseCliniaHit } from '../core/highlight';

const highlight = ({
  attribute,
  hit,
  highlightProperty,
  preTag = HIGHLIGHT_TAGS.highlightPreTag,
  postTag = HIGHLIGHT_TAGS.highlightPostTag,
}) =>
  parseCliniaHit({
    attribute,
    highlightProperty,
    hit,
    preTag,
    postTag,
  });

/**
 * connectHighlight connector provides the logic to create an highlighter
 * component that will retrieve, parse and render an highlighted property
 * from a Clinia hit.
 * @name connectHighlight
 * @kind connector
 * @category connector
 * @providedPropType {function} highlight - function to retrieve and parse an property from a hit. It takes a configuration object with 3 attributes: `highlightProperty` which is the property that contains the highlight structure from the records, `property` which is the name of the property (it can be either a string or an array of strings) to look for and `hit` which is the hit from Clinia. It returns an array of objects `{value: string, isHighlighted: boolean}`. If the element that corresponds to the property is an array of strings, it will return a nested array of objects.
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vision, SearchBox, Hits, connectHighlight } from '@clinia/react-vision-dom';
 *
 * const searchClient = clinia(
 *   'latency',
 *   '6be0576ff61c053d5f9a3225e2a90f76'
 * );
 *
 * const CustomHighlight = connectHighlight(
 *   ({ highlight, property, hit, highlightProperty }) => {
 *     const highlights = highlight({
 *       highlightProperty: '_highlightResult',
 *       property,
 *       hit
 *     });
 *
 *     return highlights.map(part => part.isHighlighted ? (
 *       <mark>{part.value}</mark>
 *     ) : (
 *       <span>{part.value}</span>
 *     ));
 *   }
 * );
 *
 * const Hit = ({ hit }) => (
 *   <p>
 *     <CustomHighlight property="name" hit={hit} />
 *   </p>
 * );
 *
 * const App = () => (
 *   <Vision
 *     searchClient={searchClient}
 *     indexName="instant_search"
 *   >
 *     <SearchBox defaultRefinement="pho" />
 *     <Hits hitComponent={Hit} />
 *   </Vision>
 * );
 */
export default createConnector({
  displayName: 'CliniaHighlighter',

  propTypes: {},

  getProvidedProps() {
    return { highlight };
  },
});
