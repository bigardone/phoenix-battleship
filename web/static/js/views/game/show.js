import React, { PropTypes }   from 'react';
import { push }               from 'react-router-redux';
import { Socket }             from 'phoenix';
import { connect }            from 'react-redux';
import { joinGame }           from '../../actions/game';
import ShipSelector           from '../../components/game/ship_selector';
import Board                  from '../../components/game/board';

class GameShowView extends React.Component {
  componentDidMount() {
    this._joinGame();
  }

  _joinGame() {
    const { dispatch, player, socket } = this.props;
    const gameId = this.props.params.id;

    dispatch(joinGame(socket, player, gameId));
  }

  render() {
    const { game } = this.props;

    if (!game) return false;

    return (
      <div id="game_show" className="view-container">
        <section id="boards_container">
          <header>
            Header
          </header>
          <ShipSelector />
          <Board data={game.my_board}/>
        </section>
        <aside id="chat_container">
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
