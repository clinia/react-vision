import { SearchResponse } from '@clinia/client-search';

export interface MultiResponse<THit = any> {
  results: Array<SearchResponse<THit>>;
}
