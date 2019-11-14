import {
  SET_QUERY,
  SET_LOCATION,
  SET_SEARCHBOX_FOCUSED,
  SET_LOCATIONBOX_FOCUSED,
} from './actions';
import { combineReducers } from 'redux';

const defaultState = {
  // Keeps track of the user input on each SearchBox `onChange` event.
  // Allows sharing of the user input on all active SearchBox components, event if the user doesn't trigger a search.
  query: undefined,
  // Keeps track of the user input on each LocationBox `onChange` event.
  // Allows sharing of the user input on all active LocationBox components, event if the user doesn't trigger a search.
  location: undefined,
  // Keeps track of the SearchBox state.
  searchBoxFocused: false,
  // Keeps track of the LocationBox state.
  locationBoxFocused: false,
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
    case SET_SEARCHBOX_FOCUSED:
      return {
        ...state,
        searchBoxFocused: action.payload.isFocused,
      };
    case SET_LOCATIONBOX_FOCUSED:
      return {
        ...state,
        locationBoxFocused: action.payload.isFocused,
      };
    default:
      return state;
  }
}

export default combineReducers({ store: reducers });
