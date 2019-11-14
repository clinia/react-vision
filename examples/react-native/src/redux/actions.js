export const SET_QUERY = 'SET_QUERY';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_SEARCHBOX_FOCUSED = 'SET_SEARCHBOX_FOCUSED';
export const SET_LOCATIONBOX_FOCUSED = 'SET_LOCATIONBOX_FOCUSED';

export const setQuery = query => ({
  type: SET_QUERY,
  payload: {
    query,
  },
});

export const setLocation = location => ({
  type: SET_LOCATION,
  payload: {
    location,
  },
});

export const setSearchBoxFocused = isFocused => ({
  type: SET_SEARCHBOX_FOCUSED,
  payload: {
    isFocused,
  },
});

export const setLocationBoxFocused = isFocused => ({
  type: SET_LOCATIONBOX_FOCUSED,
  payload: {
    isFocused,
  },
});
