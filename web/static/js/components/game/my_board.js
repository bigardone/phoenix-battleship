import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Board              from './board';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';

export default class MyBoard extends Board {
  _cellOnClick(y, x, value) {
    const { selectedShip, gameChannel, dispatch } = this.props;
    const key = `${y}${x}`;

    return (e) => {
      if (selectedShip.name === null) return false;
      if (value != Constants.GRID_VALUE_WATER) return false;

      const ship = {
        x: x,
        y: y,
        size: selectedShip.size,
        orientation: selectedShip.orientation,
      };

      gameChannel.push('game:place_ship', { ship: ship })
      .receive('ok', (payload) => {
        dispatch(setGame(payload.game));
      })
      .receive('error', (payload) => console.log(payload));
    };
  }

  _cellValue(value) {
    return false;
  }

  _boardClasses() {
    const { selectedShip } = this.props;

    return classnames({
      grid: true,
      pointer: selectedShip && selectedShip.name != null,
    });
  }

  _cellClasses(value) {
    return classnames({
      cell: true,
      ship: value === Constants.GRID_VALUE_SHIP,
      'ship-hit': value === Constants.GRID_VALUE_SHIP_HIT,
      'water-hit': value === Constants.GRID_VALUE_WATER_HIT,
    });
  }
}
