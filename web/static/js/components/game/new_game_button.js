import React, {PropTypes} from 'react';
import { newGame }        from '../../actions/home';

export default class NewGameButton extends React.Component {
  _handleClick(e) {
    const { lobbyChannel, dispatch } = this.props;

    dispatch(newGame(lobbyChannel));
  }

  render() {
    return (
      <button onClick={::this._handleClick}>{this.props.children}</button>
    );
  }
}
