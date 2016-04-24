import React, {PropTypes} from 'react';
import {Link}             from 'react-router';
import Constants          from '../../constants';

export default class ListItem extends React.Component {
  _renderStats(game) {
    if (game.defender === null) return this._renderJoinButton(game);

    return (
      <ul className="stats-list">
        {::this._renderLastTurn(game)}
        {::this._renderWinner(game)}
      </ul>
    );
  }

   _renderLastTurn(game) {
     if (game.turns.length === 0 || game.over) return false;

     const lastTurn = game.turns[0];
     const player = game.attacker === lastTurn.player_id ? 'Attacker' : 'Defender';
     const coords = `${String.fromCharCode(lastTurn.x + 65)}${lastTurn.y + 1}`;
     const result = lastTurn.result === Constants.GRID_VALUE_SHIP_HIT ? 'a ship' : 'water';

     return (
       <li>{`${player} shoots ${coords} hitting ${result}`}</li>
     );
   }

   _renderWinner(game) {
     if (!game.over) return false;

     const player = game.attacker === game.winner ? 'Attacker' : 'Defender';

     return (
       <li>{`${player} wins!`}</li>
     );
   }

  _renderJoinButton(game) {
    return (
      <Link className="button small" to={`/game/${game.id}`}>join</Link>
    );
  }

  _game;

  render() {
    const { game } = this.props;

    return (
      <li>
        {game.id}
        {::this._renderStats(game)}
      </li>
    );
  }
}
