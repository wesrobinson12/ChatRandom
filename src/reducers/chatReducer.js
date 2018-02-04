import { RECEIVE_USER } from '../actions/chatActions';

const initialState = {
  sessionUser: ''
};

const chatReducer = (state = initialState, action) => {
  Object.freeze(state);
  switch(action.type) {
    case RECEIVE_USER:
      return Object.assign({}, state, { sessionUser: action.user });
    default:
      return state;
  }
};

export default chatReducer;
