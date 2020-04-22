import React from 'react';

export type MapboxContextState = {
  // @ts-ignore
  mapboxgl: typeof mapboxgl;
  instance: mapboxgl.Map;
};

const MapboxContext = React.createContext<MapboxContextState>({
  // We mount the context only once the map is created. Thus, we can assume
  // that the value provided through the context is never `undefined`. We can't
  // create an instance at that point, hence the cast.
  // @ts-ignore
  mapboxgl: {} as typeof mapboxgl,
  instance: {} as mapboxgl.Map,
});

export default MapboxContext;
