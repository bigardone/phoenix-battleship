import React, { PropTypes } from 'react';
import classnames           from 'classnames';
import { selectShip }       from '../../actions/game';

export default class ShipSelector extends React.Component {
  _renderAvailableShips() {
    const { dispatch, selectedShip, game } = this.props;

    const ships = game.my_board.ships.map((ship, i) => {
      ship.id = i;

      if (Object.keys(ship.coordinates).length != 0) return false;

      const handleClick = (e) => {
        e.preventDefault();

        if (game.my_board.ready) return false;

        dispatch(selectShip(ship));
      };

      const classes = classnames({
        active: selectedShip.id == i,
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
        <p>The current orientation is: <span className="orientation">{selectedShip.orientation}</span></p>
        {::this._renderAvailableShips()}
      </div>
    );
  }
}
