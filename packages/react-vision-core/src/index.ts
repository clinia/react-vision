// Core
export { default as createConnector } from './core/createConnector';

// Utils
export { HIGHLIGHT_TAGS } from './core/highlight';
export { default as version } from './core/version';
export { default as translatable } from './core/translatable';

// Widgets
export { default as Configure } from './widgets/Configure';
export { default as Index } from './widgets/Index';
export { default as Vision } from './widgets/Vision';

// Connectors
export {
  default as connectAutoComplete,
} from './connectors/connectAutoComplete';
export { default as connectConfigure } from './connectors/connectConfigure';
export { default as connectHits } from './connectors/connectHits';
export { default as connectHitsPerPage } from './connectors/connectHitsPerPage';
export {
  default as connectInfiniteHits,
} from './connectors/connectInfiniteHits';
export { default as connectSearchBox } from './connectors/connectSearchBox';

// Types
export * from './types';
