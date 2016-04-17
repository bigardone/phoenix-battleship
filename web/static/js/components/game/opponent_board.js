import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Board              from './board';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class OpponentBoard extends Board {
  _cellOnClick(y, x, value) {
    const { gameChannel, currentTurn, playerId, dispatch } = this.props;

    if (currentTurn !== playerId) return false;

    const key = `${y}${x}`;

    return (e) => {
      if (value != Constants.GRID_VALUE_WATER) return false;

      gameChannel.push('game:shoot', { y: y, x: x })
      .receive('ok', (payload) => {
        dispatch(setGame(payload.game));
      })
      .receive('error', (payload) => console.log(payload));
    };
  }

  _cellValue(value) {
    return '';
  }

  _boardClasses() {
    const { playerId, currentTurn } = this.props;

    return classnames({
      grid: true,
      pointer: playerId === currentTurn,
    });
  }

  _cellClasses(value) {
    return classnames({
      cell: true,
      hit: value === Constants.GRID_VALUE_SHIP_HIT,
      'water-hit': value === Constants.GRID_VALUE_WATER_HIT,
    });
  }
}
