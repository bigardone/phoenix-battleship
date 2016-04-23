import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
import { fetchGames }           from '../../actions/home';
import NewGameButton            from '../../components/game/new_game_button';
import ListItem                 from '../../components/game/list_item';

class HomeIndexView extends React.Component {
  componentDidMount() {
    const { dispatch, lobbyChannel } = this.props;

    dispatch(fetchGames(lobbyChannel));
  }

  _renderCurrentGames() {
    const { currentGames } = this.props;

    if (currentGames.length === 0) return false;

    const gameNodes = currentGames.map((game) => {
      return (
        <ListItem key={game.id} game={game}/>
      );
    });

    return (
      <section>
        <h2>Current games</h2>
        <ul className="current-games">
          <ReactCSSTransitionGroup
            transitionName="item"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {gameNodes}
          </ReactCSSTransitionGroup>
        </ul>
      </section>
    );
  }

  render() {
    const { lobbyChannel, dispatch } = this.props;

    return (
      <div id="home_index" className="view-container">
        <header>
          <h1>Ahoy Matey, <br/>welcome to Phoenix Battleship!</h1>
          <p>The <a target="_blank" href="https://en.wikipedia.org/wiki/Battleship_(game)">Good Old game</a>, built with <a target="_blank" href="http://elixir-lang.org/">Elixir</a>, <a target="_blank" href="http://www.phoenixframework.org/">Phoenix</a>, <a target="_blank" href="http://facebook.github.io/react/">React</a> and <a target="_blank" href="http://redux.js.org/">Redux</a></p>
          <NewGameButton lobbyChannel={lobbyChannel} dispatch={dispatch}>Start new battle, arr!</NewGameButton>
        </header>
        {::this._renderCurrentGames()}
        <footer>
          <p><small>crafted with ♥ by <a target="_blank" href="http://codeloveandboards.com/">@bigardone</a></small></p>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.home }
);

export default connect(mapStateToProps)(HomeIndexView);
