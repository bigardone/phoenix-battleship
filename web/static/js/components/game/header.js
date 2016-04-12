import React, {PropTypes} from 'react';

export default class Header extends React.Component {
  _renderContent() {
    const title = this._titleText();

    return (
      <h1>{::this._titleText()}</h1>
    );
  }

  _titleText() {
    const { game, player, currentTurn } = this.props;
    const { my_board, opponents_board, readyForBattle } = game;

    if (!my_board.ready) {
      return 'Place your ships';
    } else if (!opponents_board || !opponents_board.ready) {
      return 'Waiting for opponent ';
    } else if (currentTurn && currentTurn.id === player.id) {
      return 'Your turn!';
    } else if (currentTurn && currentTurn.id != player.id) {
      return 'Your opponent\'s turn!';
    } else {
      return 'Let the battle begin';
    }
  }

  render() {
    return (
      <header id="game_header">{::this._renderContent()}</header>
    );
  }
}
