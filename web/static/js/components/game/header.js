import React, {PropTypes} from 'react';

export default class Header extends React.Component {
  _renderContent() {
    const { game } = this.props;

    const title = this._titleText(game);
    return (
      <h1>{::this._titleText(game)}</h1>
    );
  }

  _titleText(game) {
    const { my_board, opponents_board } = game;

    if (!my_board.ready) {
      return 'Place your ships';
    } else if (!opponents_board || !opponents_board.ready) {
      return 'Waiting for opponent ';
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
