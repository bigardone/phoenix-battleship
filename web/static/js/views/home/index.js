import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import NewGameButton        from '../../components/game/new_game_button';

class HomeIndexView extends React.Component {
  render() {
    const { playerChannel, dispatch } = this.props;

    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy, Matey!</h1>
        </header>
        <NewGameButton playerChannel={playerChannel} dispatch={dispatch}>Start new battle, arr!</NewGameButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(HomeIndexView);
