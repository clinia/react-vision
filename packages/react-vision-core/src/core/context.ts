import { createContext } from 'react';
import { Store } from '../core/createStore';

export type VisionContext = {
  onInternalStateUpdate: (...args: any[]) => any;
  createHrefForState: (...args: any[]) => string;
  onSearchForSuggestions: (...args: any[]) => any;
  onSearchStateChange: (...args: any[]) => any;
  onSearchParameters: (...args: any[]) => any;
  store: Store;
  widgetsManager: any;
  mainTargetedIndex: string;
};

export const {
  Consumer: VisionConsumer,
  Provider: VisionProvider,
} = createContext<VisionContext>({
  onInternalStateUpdate: () => undefined,
  createHrefForState: () => '#',
  onSearchForSuggestions: () => undefined,
  onSearchStateChange: () => undefined,
  onSearchParameters: () => undefined,
  store: {} as Store,
  widgetsManager: {},
  mainTargetedIndex: '',
});

export type IndexContext =
  | {
      targetedIndex: string;
    }
  | undefined;

export const {
  Consumer: IndexConsumer,
  Provider: IndexProvider,
} = createContext<IndexContext>(undefined);
