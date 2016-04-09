import React, { PropTypes }   from 'react';
import { Socket }             from 'phoenix';
import { connect }            from 'react-redux';
import { joinGame }           from '../../actions/game';
import ShipSelector           from '../../components/game/ship_selector';
import Board                  from '../../components/game/board';
import Chat                   from '../../components/game/chat';
import Header                 from '../../components/game/header';

class GameShowView extends React.Component {
  componentDidMount() {
    this._joinGame();
  }

  _joinGame() {
    const { dispatch, player, socket } = this.props;
    const gameId = this.props.params.id;

    dispatch(joinGame(socket, player, gameId));
  }

  _opponentIsConnected() {
    const { player, game } = this.props;

    return player.id == game.attacker.id ? game.defender != null : game.attacker != null;
  }

  render() {
    const { dispatch, game, gameChannel, selectedShip } = this.props;

    if (!game) return false;

    return (
      <div id="game_show" className="view-container">
        <section id="boards_container">
          <Header game={game} />
          <div id="opponents_board_container">
            <Board
              dispatch={dispatch}
              gameChannel={gameChannel}
              selectedShip={selectedShip}
              data={game.opponents_board}/>
          </div>
          <div id="my_board_container">
            <ShipSelector
              dispatch={dispatch}
              game={game}
              selectedShip={selectedShip} />
            <Board
              dispatch={dispatch}
              gameChannel={gameChannel}
              selectedShip={selectedShip}
              data={game.my_board}/>
          </div>
        </section>
        <Chat
          dispatch={dispatch}
          opponentIsConnected={::this._opponentIsConnected()}
          gameChannel={gameChannel}
          messages={game.messages}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
