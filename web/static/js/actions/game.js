import Constants  from '../constants';

export function joinGame(socket, player, gameId) {
  return dispatch => {
    const channel = socket.channel(`game:${gameId}`);
    channel.join()
    .receive('ok', () => {
      channel.push('game:get_data', { game_id: gameId, player_id: player.id })
      .receive('ok', (payload) => {
        dispatch(setChannelAndGame(channel, payload.game));
      });
    })
    .receive('error', (payload) => {
      if (payload.reason === 'No more players allowed') dispatch(push('/'));
      if (payload.reason === 'Game does not exist') dispatch(push('/'));
    });
  };
}

export function setChannelAndGame(channel, game) {
  return dispatch => {
    dispatch({
      type: Constants.GAME_SET_CHANNEL,
      channel: channel,
    });

    dispatch(setGame(game));
  };
}

export function setGame(game) {
  return dispatch => {
    dispatch({
      type: Constants.GAME_SET_GAME,
      game: game,
    });
  };
}
