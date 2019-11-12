import { SET_QUERY, SET_LOCATION, SET_SUGGESTION_MODE } from './actions';
import { combineReducers } from 'redux';
import SuggestionMode from './suggestionMode';

const defaultState = {
  // Keeps track of the user input on each SearchBox `onChange` event.
  // Allows sharing of the user input on all active SearchBox components, event if the user doesn't trigger a search.
  query: undefined,
  // Keeps track of the user input on each LocationBox `onChange` event.
  // Allows sharing of the user input on all active LocationBox components, event if the user doesn't trigger a search.
  location: undefined,
  // Keeps track of the SearchBox state.
  suggestionMode: SuggestionMode.None,
};

function reducers(state = defaultState, action) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        query: action.payload.query,
      };
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload.location,
      };
    case SET_SUGGESTION_MODE:
      return {
        ...state,
        suggestionMode: action.payload.mode,
      };
    default:
      return state;
  }
}

export default combineReducers({ store: reducers });
