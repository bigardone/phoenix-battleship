import { push }       from 'react-router-redux';
import Constants      from '../constants';
import { setPlayer }  from './session';

export function fetchGames(channel) {
  return dispatch => {
    channel.on('update_games', (payload) => {
      dispatch({
        type: Constants.HOME_SET_CURRENT_GAMES,
        games: payload.games,
      });
    });

    channel.push('current_games')
    .receive('ok', (payload) => {
      dispatch({
        type: Constants.HOME_SET_CURRENT_GAMES,
        games: payload.games,
      });
    });
  };
}

export function newGame(channel) {
  return dispatch => {
    channel.push('new_game')
    .receive('ok', (payload) => {
      dispatch(push(`/game/${payload.game_id}`));
    });
  };
}
