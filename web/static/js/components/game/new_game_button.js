import React, {PropTypes} from 'react';
import { newGame }        from '../../actions/home';

export default class NewGameButton extends React.Component {
  _handleClick(e) {
    const { playerChannel, dispatch } = this.props;

    dispatch(newGame(playerChannel));
  }

  render() {
    return (
      <button onClick={::this._handleClick} type="submit" >{this.props.children}</button>
    );
  }
}
