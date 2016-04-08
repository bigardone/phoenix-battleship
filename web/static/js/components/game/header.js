import React, {PropTypes} from 'react';

export default class Header extends React.Component {
  _renderContent() {
    const { game } = this.props;
  }

  render() {
    return (
      <header id="game_header">{::this._renderContent}</header>
    );
  }
}
