import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Board              from './board';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class OpponentBoard extends Board {
  _cellOnClick(y, x, value) {
    const { gameChannel, currentTurn, player, dispatch } = this.props;

    if (!currentTurn || currentTurn.id !== player.id) return false;

    const key = `${y}${x}`;

    return (e) => {
      if (value != Constants.GRID_VALUE_WATTER) return false;

      gameChannel.push('game:shoot', { y: y, x: x })
      .receive('ok', (payload) => {
        dispatch(setGame(payload.game));
      })
      .receive('error', (payload) => console.log(payload));
    };
  }

  _cellValue(value) {
    return (value);
  }
}
