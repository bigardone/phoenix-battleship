import Constants      from '../constants';
import { setPlayer }  from './session';

export function newGame(player) {
  return dispatch => {
    dispatch(setPlayer(player));
  };
}
