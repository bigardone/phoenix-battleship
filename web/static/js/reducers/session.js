import Constants from '../constants';

const initialState = {
  player: {
    id: localStorage.getItem('playerId'),
    name: localStorage.getItem('playerName'),
  },
  socket: null,
  channel: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SESSION_SET_PLAYER:
      return {
        ...state,
        player: action.player,
        socket: action.socket,
        channel: action.channel,
      };

    default:
      return state;
  }
}
