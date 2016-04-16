import { push }       from 'react-router-redux';
import Constants      from '../constants';
import { setPlayer }  from './session';

export function newGame(channel) {
  return dispatch => {
    channel.push('game:new')
    .receive('ok', (payload) => {
      dispatch(push(`/game/${payload.game_id}`));
    });
  };
}
