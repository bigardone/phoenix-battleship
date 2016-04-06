import { Socket } from 'phoenix';
import Constants  from '../constants';

const player = {
  id: localStorage.getItem('playerId'),
  name: localStorage.getItem('playerName'),
};

const socket = new Socket('/socket', {
  params: {
    id: player.id,
    name: player.name,
  },
  logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); },
});

socket.connect();

const channel = socket.channel(`player:${player.id}`);

channel.join();

const initialState = {
  player: player,
  socket: socket,
  userChannel: channel,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SESSION_SET_PLAYER:
      return {
        ...state,
        player: action.player,
        socket: action.socket,
        userChannel: action.channel,
      };

    default:
      return state;
  }
}
