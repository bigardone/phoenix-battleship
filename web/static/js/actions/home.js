import { push }       from 'react-router-redux';
import Constants      from '../constants';
import { setPlayer }  from './session';

export function newGame(player, channel) {
  return dispatch => {
    // dispatch(setPlayer(player, socket, channel));

    channel.push('game:new')
    .receive('ok', (payload) => {
      dispatch(push(`/game/${payload.game_id}`));
    });
  };
}
