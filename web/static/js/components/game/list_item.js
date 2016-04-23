import React, {PropTypes} from 'react';
import {Link}             from 'react-router';

export default class ListItem extends React.Component {
  _renderJoinButton(game) {
    if (game.defender != null) return false;

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
        {::this._renderJoinButton(game)}
      </li>
    );
  }
}
