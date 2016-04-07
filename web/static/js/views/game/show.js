import React, { PropTypes }   from 'react';
import { Socket }             from 'phoenix';
import { connect }            from 'react-redux';
import { joinGame }           from '../../actions/game';
import ShipSelector           from '../../components/game/ship_selector';
import Board                  from '../../components/game/board';
import Chat                   from '../../components/game/chat';

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
    const { dispatch, game } = this.props;

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
        <Chat dispatch={dispatch}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
