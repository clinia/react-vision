import { SET_QUERY, SET_IS_SEARCHING } from './actions';
import { combineReducers } from 'redux';

const defaultState = {
  // Keeps track of the user input on each SearchBox `onChange` event.
  // Allows sharing of the user input on all active SearchBox components, event if the user doesn't trigger a search.
  query: undefined,
  // Keeps track of the search state.
  isSearching: false,
};

function reducers(state = defaultState, action) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        query: action.payload.query,
      };
    case SET_IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload.isSearching,
      };
    default:
      return state;
  }
}

export default combineReducers({ store: reducers });
