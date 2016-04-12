import Constants  from '../constants';

export function setPlayer(playerId, socket, channel) {

  return dispatch => {
    dispatch({
      type: Constants.SESSION_SET_PLAYER,
      playerId: playerId,
      socket: socket,
      channel: channel,
    });
  };
}
