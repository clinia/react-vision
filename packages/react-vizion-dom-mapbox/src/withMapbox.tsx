import React from 'react';
import MapboxContext from './MapboxContext';

type Subtract<TProps, TSubstractedProps> = Omit<
  TProps,
  keyof TSubstractedProps
>;

export interface WithMapboxProps {
  mapboxgl: typeof mapboxgl;
  mapboxglInstance: mapboxgl.Map;
}

const withMapbox = <TProps extends WithMapboxProps>(
  Wrapped: React.ComponentType<TProps>
) => {
  const WithMapbox: React.FC<Subtract<TProps, WithMapboxProps>> = props => (
    <MapboxContext.Consumer>
      {({ mapboxgl, instance }) => (
        <Wrapped
          {...(props as TProps)}
          mapboxgl={mapboxgl}
          mapboxglInstance={instance}
        />
      )}
    </MapboxContext.Consumer>
  );

  return WithMapbox;
};

export default withMapbox;
