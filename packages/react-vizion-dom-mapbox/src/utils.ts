export const betweenRange = (value: number, n1: number, n2: number) => {
  return n1 <= value && n2 >= value;
};

export const isValidCoordinates = (lat: any, lon: any) => {
  return latitude(lat) && longitude(lon);
};

const isNumber = (n: any) => {
  return typeof n === 'number';
};

function longitude(lon: any) {
  return Boolean(isNumber(lon) && betweenRange(lon, -180, 180));
}

function latitude(lat: any) {
  return Boolean(isNumber(lat) && betweenRange(lat, -90, 90));
}
