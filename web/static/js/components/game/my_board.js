import React, {PropTypes} from 'react';
import classnames         from 'classnames';
import Board              from './board';
import Constants          from '../../constants';
import { setGame }        from '../../actions/game';
import { setError }       from '../../actions/game';

export default class MyBoard extends Board {
  _handleCellClick(y, x, value) {
    const { selectedShip, gameChannel, dispatch } = this.props;
    const key = `${y}${x}`;

    return (e) => {
      if (selectedShip.id === null) return false;
      if (value != Constants.GRID_VALUE_WATER) return false;

      const ship = {
        x: x,
        y: y,
        size: selectedShip.size,
        orientation: selectedShip.orientation,
      };

      gameChannel.push('game:place_ship', { ship: ship })
      .receive('ok', (payload) => dispatch(setGame(payload.game)))
      .receive('error', (payload) => dispatch(setError(payload.reason)));
    };
  }

  _handleCellMouseOver(y, x) {
    return this._toggleCellClasses(y, x);
  }

  _handleCellMouseOut(y, x) {
    return this._toggleCellClasses(y, x);
  }

  _toggleCellClasses(y, x) {
    const { selectedShip } = this.props;

    if (selectedShip.size === 0) return false;

    const { size, orientation } = selectedShip;

    const className = this._validCoords(y, x, orientation, size) ? 'ship-shape' : 'ship-shape-invalid';

    return (e) => {
      for (var i = 0; i < size; i++) {
        const coords = orientation === 'horizontal' ? `${y}${x + i}` : `${y + i}${x}`;
        let cell = document.getElementById(coords);
        if (!cell) break;
        cell.classList.toggle(className);
      }
    };
  }

  _cellValue(value) {
    return false;
  }

  _boardClasses() {
    const { selectedShip } = this.props;

    return classnames({
      grid: true,
      pointer: selectedShip && selectedShip.id != null,
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

  _cellId(ref) {
    return ref;
  }

  _validCoords(y, x, orientation, size) {
    const { data } = this.props;
    let inbounds;

    if (orientation === 'horizontal') {
      inbounds = (x + size) <= 10;
    } else {
      inbounds = (y + size) <= 10;
    }

    let overlapping = false;

    for (var i = 0; i < size; i++) {
      const coords = orientation === 'horizontal' ? `${y}${x + i}` : `${y + i}${x}`;
      if (data.grid[coords] != Constants.GRID_VALUE_WATER) {
        overlapping = true;
        break;
      }
    }

    return inbounds && !overlapping;
  }
}
