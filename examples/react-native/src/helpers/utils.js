export const randomId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9);

export const deltaRegionToBoundsRegion = deltaRegion => {
  const northEast = {
    lat: deltaRegion.latitude + deltaRegion.latitudeDelta / 2,
    lng: deltaRegion.longitude + deltaRegion.longitudeDelta / 2,
  };
  const southWest = {
    lat: deltaRegion.latitude - deltaRegion.latitudeDelta / 2,
    lng: deltaRegion.longitude - deltaRegion.longitudeDelta / 2,
  };

  return {
    northEast,
    southWest,
  };
};

export const boundsRegionToDeltaRegion = boundsRegion => {
  const { northEast, southWest } = boundsRegion;

  const latitudeDelta = (northEast.lat - southWest.lat) / 2;
  const longitudeDelta = (northEast.lng - southWest.lng) / 2;
  const latitude = southWest.lat + latitudeDelta;
  const longitude = southWest.lng + longitudeDelta;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};
