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
      if (Object.keys(ship.coordinates).length != 0) return false;

      const config = shipConfigurations.find((item) => item.size === ship.size);

      const handleClick = (e) => {
        e.preventDefault();

        if (game.my_board.ready) return false;

        dispatch(selectShip(config));
      };

      const classes = classnames({
        active: config.name == selectedShip.name,
      });

      return (
        <li
          className={classes}
          key={i}>{::this._renderShip(ship.size, handleClick)}</li>
      );
    });

    return (
      <ul>{ships}</ul>
    );
  }

  _renderShip(size, handleClick) {
    const nodes = [];

    for (var i = 0; i < size; i++) {
      nodes.push(<span key={i}></span>);
    }

    return (
      <div className="ship" onClick={handleClick}>{nodes}</div>
    );
  }

  render() {
    const { selectedShip, game } = this.props;

    if (game.my_board.ready) return false;

    return (
      <div id="ship_selector">
        <p>
          Select a ship by clicking on it. Click on it again to switch orientation.
          The current orientation is: <br/>
          <span className="orientation">{selectedShip.orientation}</span></p>
        {::this._renderAvailableShips()}
      </div>
    );
  }
}
