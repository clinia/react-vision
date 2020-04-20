import React from 'react';
import { connectPagination } from '@clinia/react-vizion-core';
import PanelCallbackHandler from '../components/PanelCallbackHandler';
import Pagination from '../components/Pagination';

/**
 * The Pagination widget displays a simple pagination system allowing the user to
 * change the current page.
 * @name Pagination
 * @kind widget
 * @propType {boolean} [showFirst=true] - Display the first page link.
 * @propType {boolean} [showLast=false] - Display the last page link.
 * @propType {boolean} [showPrevious=true] - Display the previous page link.
 * @propType {boolean} [showNext=true] - Display the next page link.
 * @propType {number} [padding=3] - How many page links to display around the current page.
 * @propType {number} [totalPages=Infinity] - Maximum number of pages to display.
 * @themeKey cvi-pagination - the root div of the widget
 * @themeKey cvi-pagination--noRefinement - the root div of the widget when there is no refinement
 * @themeKey cvi-pagination-list - the list of all pagination items
 * @themeKey cvi-pagination-list--noRefinement - the list of all pagination items when there is no refinement
 * @themeKey cvi-pagination-item - the pagination list item
 * @themeKey cvi-pagination-item--firstPage - the "first" pagination list item
 * @themeKey cvi-pagination-item--lastPage - the "last" pagination list item
 * @themeKey cvi-pagination-item--previousPage - the "previous" pagination list item
 * @themeKey cvi-pagination-item--nextPage - the "next" pagination list item
 * @themeKey cvi-pagination-item--page - the "page" pagination list item
 * @themeKey cvi-pagination-item--selected - the selected pagination list item
 * @themeKey cvi-pagination-item--disabled - the disabled pagination list item
 * @themeKey cvi-pagination-link - the pagination clickable element
 * @translationKey previous - Label value for the previous page link
 * @translationKey next - Label value for the next page link
 * @translationKey first - Label value for the first page link
 * @translationKey last - Label value for the last page link
 * @translationkey page - Label value for a page item. You get function(currentRefinement) and you need to return a string
 * @translationKey ariaPrevious - Accessibility label value for the previous page link
 * @translationKey ariaNext - Accessibility label value for the next page link
 * @translationKey ariaFirst - Accessibility label value for the first page link
 * @translationKey ariaLast - Accessibility label value for the last page link
 * @translationkey ariaPage - Accessibility label value for a page item. You get function(currentRefinement) and you need to return a string
 * @example
 * import React from 'react';
 * import clinia from 'clinia/lite';
 * import { Vizion, Pagination } from '@clinia/react-vizion-dom';
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
 *     <Pagination />
 *   </Vizion>
 * );
 */

const PaginationWidget = props => (
  <PanelCallbackHandler {...props}>
    <Pagination {...props} />
  </PanelCallbackHandler>
);

export default connectPagination(PaginationWidget);
