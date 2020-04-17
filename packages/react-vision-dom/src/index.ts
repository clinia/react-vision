// Core
export { createConnector } from '@clinia/react-vision-core';
export { HIGHLIGHT_TAGS } from '@clinia/react-vision-core';
export { translatable } from '@clinia/react-vision-core';

// Widget
export { Configure } from '@clinia/react-vision-core';
export { Index } from '@clinia/react-vision-core';
export { Vision } from '@clinia/react-vision-core';

// Connectors
export { connectAutoComplete } from '@clinia/react-vision-core';
export { connectConfigure } from '@clinia/react-vision-core';
export { connectCurrentRefinements } from '@clinia/react-vision-core';
export { connectGeoSearch } from '@clinia/react-vision-core';
export { connectHighlight } from '@clinia/react-vision-core';
export { connectHitInsights } from '@clinia/react-vision-core';
export { connectHits } from '@clinia/react-vision-core';
export { connectHitsPerPage } from '@clinia/react-vision-core';
export { connectInfiniteHits } from '@clinia/react-vision-core';
export { connectPagination } from '@clinia/react-vision-core';
export { connectSearchBox } from '@clinia/react-vision-core';
export { connectStateResults } from '@clinia/react-vision-core';
export { connectStats } from '@clinia/react-vision-core';

// DOM
export { default as ClearRefinements } from './widgets/ClearRefinements';
export { default as CurrentRefinements } from './widgets/CurrentRefinements';
export { default as Highlight } from './widgets/Highlight';
export { default as Hits } from './widgets/Hits';
export { default as HitsPerPage } from './widgets/HitsPerPage';
export { default as InfiniteHits } from './widgets/InfiniteHits';
export { default as Pagination } from './widgets/Pagination';
export { default as Panel } from './widgets/Panel';
export { default as SearchBox } from './widgets/SearchBox';
export { default as Stats } from './widgets/Stats';

// Utils
export { createClassNames } from './core/utils';

// insights
export {
  default as getInsightsAnonymousUserToken,
} from './core/getInsightsAnonymousUserToken';
