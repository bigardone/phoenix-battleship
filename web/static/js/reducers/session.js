import Constants from '../constants';

const initialState = {
  player: {
    id: localStorage.getItem('playerId'),
    name: localStorage.getItem('playerName'),
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SESSION_SET_PLAYER:
      return { ...state, player: action.player };

    default:
      return state;
  }
}
