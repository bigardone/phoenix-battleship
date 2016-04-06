import Constants  from '../constants';

export function setPlayer(player, socket, channel) {
  localStorage.setItem('playerName', player.name);

  return dispatch => {
    dispatch({
      type: Constants.SESSION_SET_PLAYER,
      player: player,
      socket: socket,
      channel: channel,
    });
  };
}
