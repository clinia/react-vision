import { createContext } from 'react';
import { Store } from '../core/createStore';

export type VizionContext = {
  onInternalStateUpdate: (...args: any[]) => any;
  createHrefForState: (...args: any[]) => string;
  onSearchStateChange: (...args: any[]) => any;
  onSearchParameters: (...args: any[]) => any;
  store: Store;
  widgetsManager: any;
  mainTargetedIndex: string;
};

export const {
  Consumer: VizionConsumer,
  Provider: VizionProvider,
} = createContext<VizionContext>({
  onInternalStateUpdate: () => undefined,
  createHrefForState: () => '#',
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
