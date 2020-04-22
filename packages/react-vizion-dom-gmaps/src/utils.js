import PropTypes from 'prop-types';

export const registerEvents = (events, props, instance) => {
  const eventsAvailable = Object.keys(events);
  const listeners = Object.keys(props)
    .filter(key => eventsAvailable.indexOf(key) !== -1)
    .map(name =>
      instance.addListener(events[name], event => {
        props[name]({ event, marker: instance });
      })
    );

  return () => {
    listeners.forEach(listener => listener.remove());
  };
};

export const createListenersPropTypes = eventTypes =>
  Object.keys(eventTypes).reduce(
    (acc, name) => ({ ...acc, [name]: PropTypes.func }),
    {}
  );

export const createFilterProps = excludes => props =>
  Object.keys(props)
    .filter(name => excludes.indexOf(name) === -1)
    .reduce(
      (acc, name) => ({
        ...acc,
        [name]: props[name],
      }),
      {}
    );

export const betweenRange = (value, n1, n2) => {
  return n1 <= value && n2 >= value;
};

export const isValidCoordinates = (lat, lon) => {
  return latitude(lat) && longitude(lon);
};

const isNumber = n => {
  return typeof n === 'number';
};

function longitude(lon) {
  return Boolean(isNumber(lon) && betweenRange(lon, -180, 180));
}

function latitude(lat) {
  return Boolean(isNumber(lat) && betweenRange(lat, -90, 90));
}
