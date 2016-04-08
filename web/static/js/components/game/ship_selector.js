import React, { PropTypes } from 'react';
import classnames           from 'classnames';
import { selectShip }       from '../../actions/game';

const shipConfigurations = [
  { name: 'Aircraft carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Destroyer', size: 2 },
  { name: 'Submarine', size: 1 },
];

export default class ShipSelector extends React.Component {
  _renderAvailableShips() {
    const { dispatch, selectedShip, game } = this.props;

    const ships = shipConfigurations.map((ship, i) => {
      const handleClick = (e) => {
        e.preventDefault();

        if (game.my_board.ready) return false;

        dispatch(selectShip(ship));
      };

      const classes = classnames({
        active: ship.name == selectedShip.name,
      });

      return (
        <li
          className={classes}
          key={i}
          onClick={handleClick}>{ship.name}</li>
      );
    });

    return (
      <ul>{ships}</ul>
    );
  }

  render() {
    return (
      <div id="ship_selector">
        {::this._renderAvailableShips()}
      </div>
    );
  }
}
