import { Socket } from 'phoenix';
import Constants  from '../constants';

const playerId = localStorage.getItem('playerId');

const socket = new Socket('/socket', {
  params: {
    id: playerId,
  },
  logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); },
});

socket.connect();

const channel = socket.channel(`player:${playerId}`);

channel.join();

const initialState = {
  playerId: playerId,
  socket: socket,
  playerChannel: channel,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SESSION_SET_PLAYER:
      return {
        ...state,
        playerId: action.player_id,
        socket: action.socket,
        playerChannel: action.channel,
      };

    default:
      return state;
  }
}
