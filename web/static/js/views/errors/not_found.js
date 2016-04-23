import React, {PropTypes} from 'react';
import { connect }          from 'react-redux';
import NewGameButton        from '../../components/game/new_game_button';
import Logo                 from '../../components/common/logo';

class NotFoundView extends React.Component {
  render() {
    const { lobbyChannel, dispatch } = this.props;

    return (
      <div id="not_found" className="view-container">
        <Logo/>
        <h1>Yo Ho Ho, game not found!</h1>
        <NewGameButton lobbyChannel={lobbyChannel} dispatch={dispatch}>Start new battle, arr!</NewGameButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(NotFoundView);
