// Core
export { createConnector } from '@clinia/react-vizion-core';
export { HIGHLIGHT_TAGS } from '@clinia/react-vizion-core';
export { translatable } from '@clinia/react-vizion-core';

// Widget
export { Configure } from '@clinia/react-vizion-core';
export { Index } from '@clinia/react-vizion-core';
export { Vizion } from '@clinia/react-vizion-core';

// Connectors
export { connectAutoComplete } from '@clinia/react-vizion-core';
export { connectConfigure } from '@clinia/react-vizion-core';
export { connectCurrentRefinements } from '@clinia/react-vizion-core';
export { connectGeoSearch } from '@clinia/react-vizion-core';
export { connectHighlight } from '@clinia/react-vizion-core';
export { connectHitInsights } from '@clinia/react-vizion-core';
export { connectHits } from '@clinia/react-vizion-core';
export { connectMenu } from '@clinia/react-vizion-core';
export { connectPerPage } from '@clinia/react-vizion-core';
export { connectInfiniteHits } from '@clinia/react-vizion-core';
export { connectPagination } from '@clinia/react-vizion-core';
export { connectRefinementList } from '@clinia/react-vizion-core';
export { connectSearchBox } from '@clinia/react-vizion-core';
export { connectStateResults } from '@clinia/react-vizion-core';
export { connectStats } from '@clinia/react-vizion-core';

// DOM
export { default as ClearRefinements } from './widgets/ClearRefinements';
export { default as CurrentRefinements } from './widgets/CurrentRefinements';
export { default as Highlight } from './widgets/Highlight';
export { default as Hits } from './widgets/Hits';
export { default as InfiniteHits } from './widgets/InfiniteHits';
export { default as Menu } from './widgets/Menu';
export { default as MenuSelect } from './widgets/MenuSelect';
export { default as Pagination } from './widgets/Pagination';
export { default as Panel } from './widgets/Panel';
export { default as PerPage } from './widgets/PerPage';
export { default as RefinementList } from './widgets/RefinementList';
export { default as SearchBox } from './widgets/SearchBox';
export { default as Stats } from './widgets/Stats';
export { default as ToggleRefinement } from './widgets/ToggleRefinement';

// Utils
export { createClassNames } from './core/utils';

// insights
export {
  default as getInsightsAnonymousUserToken,
} from './core/getInsightsAnonymousUserToken';
