export const SET_QUERY = 'SET_QUERY';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_SUGGESTION_MODE = 'SET_SUGGESTIONs_MODE';

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

export const setSuggestionMode = mode => ({
  type: SET_SUGGESTION_MODE,
  payload: {
    mode,
  },
});
