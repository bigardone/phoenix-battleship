import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import NewGameButton        from '../../components/game/new_game_button';

class HomeIndexView extends React.Component {
  render() {
    const { playerChannel, dispatch } = this.props;

    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy Matey, <br/>welcome to Phoenix Battleship!</h1>
          <p>The <a target="_blank" href="https://en.wikipedia.org/wiki/Battleship_(game)">Good Old game</a>, built with <a target="_blank" href="http://elixir-lang.org/">Elixir</a>, <a target="_blank" href="http://www.phoenixframework.org/">Phoenix</a>, <a target="_blank" href="http://facebook.github.io/react/">React</a> and <a target="_blank" href="http://redux.js.org/">Redux</a></p>
        </header>
        <NewGameButton playerChannel={playerChannel} dispatch={dispatch}>Start new battle, arr!</NewGameButton>
        <footer>
          <p><small>crafted with ♥ by <a target="_blank" href="http://codeloveandboards.com/">@bigardone</a></small></p>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  state.session
);

export default connect(mapStateToProps)(HomeIndexView);
