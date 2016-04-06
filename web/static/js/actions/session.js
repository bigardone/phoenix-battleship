import Constants from '../constants';

export function setPlayer(player) {
  localStorage.setItem('playerName', player.name);

  return dispatch => {
    dispatch({
      type: Constants.SESSION_SET_PLAYER,
      player: player,
    });
  };
}
