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

    const ships = game.my_board.ships.map((ship, i) => {
      const config = shipConfigurations.find((item) => item.size === ship.size);

      const handleClick = (e) => {
        e.preventDefault();

        if (game.my_board.ready) return false;

        dispatch(selectShip(config));
      };

      const classes = classnames({
        active: config.name == selectedShip.name,
      });

      const orientation = config.name == selectedShip.name ? selectedShip.orientation : '';

      return (
        <li
          className={classes}
          key={i}
          onClick={handleClick}>{config.name} {orientation}</li>
      );
    });

    return (
      <ul>{ships}</ul>
    );
  }

  render() {
    return (
      <div id="ship_selector">
        <header>
          <h2>Your ships</h2>
        </header>
        {::this._renderAvailableShips()}
      </div>
    );
  }
}
