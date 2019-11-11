export const SET_QUERY = 'SET_QUERY';
export const SET_IS_SEARCHING = 'SET_IS_SEARCHING';

export const setQuery = query => ({
  type: SET_QUERY,
  payload: {
    query,
  },
});

export const setIsSearching = isSearching => ({
  type: SET_IS_SEARCHING,
  payload: {
    isSearching,
  },
});
