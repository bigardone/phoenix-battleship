import React, { PropTypes }   from 'react';
import { Socket }             from 'phoenix';
import { connect }            from 'react-redux';
import { joinGame }           from '../../actions/game';
import ShipSelector           from '../../components/game/ship_selector';
import Board                  from '../../components/game/board';
import MyBoard                from '../../components/game/my_board';
import OpponentBoard          from '../../components/game/opponent_board';
import Chat                   from '../../components/game/chat';
import Header                 from '../../components/game/header';

class GameShowView extends React.Component {
  componentDidMount() {
    this._joinGame();
  }

  _joinGame() {
    const { dispatch, playerId, socket } = this.props;
    const gameId = this.props.params.id;

    dispatch(joinGame(socket, playerId, gameId));
  }

  _opponentIsConnected() {
    const { playerId, game } = this.props;

    return playerId == game.attacker ? game.defender != null : game.attacker != null;
  }

  render() {
    const { dispatch, game, gameChannel, selectedShip, playerId, currentTurn, messages } = this.props;

    if (!game) return false;

    return (
      <div id="game_show" className="view-container">
        <section id="main_section">
          <Header
            game={game}
            playerId={playerId}
            currentTurn={currentTurn} />
          <section id="boards_container">
            <div id="my_board_container">
              <header>
                <h2>Your ships</h2>
              </header>
              <MyBoard
                dispatch={dispatch}
                gameChannel={gameChannel}
                selectedShip={selectedShip}
                data={game.my_board}/>
              <ShipSelector
                dispatch={dispatch}
                game={game}
                selectedShip={selectedShip} />
            </div>
            <div id="opponents_board_container">
              <header>
                <h2>Shooting grid</h2>
              </header>
              <OpponentBoard
                dispatch={dispatch}
                gameChannel={gameChannel}
                data={game.opponents_board}
                playerId={playerId}
                currentTurn={currentTurn}/>
            </div>
          </section>
        </section>
        <Chat
          dispatch={dispatch}
          opponentIsConnected={::this._opponentIsConnected()}
          gameChannel={gameChannel}
          messages={messages}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
