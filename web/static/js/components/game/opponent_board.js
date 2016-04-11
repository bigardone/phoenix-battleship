import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Board              from './board';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class OpponentBoard extends Board {
  _cellOnClick(y, x, value) {
    const { gameChannel, dispatch } = this.props;
    const key = `${y}${x}`;

    return (e) => {
      if (value != Constants.GRID_VALUE_WATTER) return false;

      gameChannel.push('game:shoot', { y: y, x: x })
      .receive('ok', (payload) => {
        console.log(payload);
      })
      .receive('error', (payload) => console.log(payload));
    };
  }
}
