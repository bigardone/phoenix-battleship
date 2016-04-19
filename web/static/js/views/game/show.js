import React, { PropTypes }   from 'react';
import { Socket }             from 'phoenix';
import { connect }            from 'react-redux';
import { joinGame }           from '../../actions/game';
import { resetGame }          from '../../actions/game';
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

  componentWillUnmount() {
    const { dispatch, gameChannel } = this.props;

    if (gameChannel != null) gameChannel.leave();

    dispatch(resetGame());
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

  _renderOpponentBoard() {
    const { dispatch, game, gameChannel, playerId, currentTurn, readyForBattle } = this.props;

    if (!readyForBattle) return this._renderInstructions();

    return (
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
    );
  }

  _renderInstructions() {
    const { readyForBattle } = this.props;

    if (readyForBattle) return false;

    const url = document.URL;
    const handleGameLinkClick = (e) => {
      e.preventDefault();
      const link = e.target;
      link.select();
      document.execCommand('copy');
    };

    return (
      <div id="opponents_board_container">
        <header>
          <h2>Instructions</h2>
        </header>
        <ol className="instructions">
          <li>Copy this link <input onClick={handleGameLinkClick} defaultValue={url} readOnly={true}/>
            by clicking on it and share it with your opponent.                                                            </li>
          <li>To place a ship in your board select one by clicking on the gray boxes.</li>
          <li>The selected ship will turn green.</li>
          <li>Switch the orientation of the ship by clicking again on it.</li>
          <li>To place the selected ship click on the cell where you want it to start.</li>
          <li>Repeat the process until you place all your ships.</li>
          <li>Tha battle will start as soon as both players have placed all their ships.</li>
          <li>Good luck!</li>
        </ol>
      </div>
    );
  }

  _renderError() {
    const { error } = this.props;

    if (!error) return false;

    return (
      <div className="error">{error}</div>
    );
  }

  _renderGame() {
    const { dispatch, game, gameChannel, selectedShip, playerId, currentTurn, messages } = this.props;

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
              <ShipSelector
                dispatch={dispatch}
                game={game}
                selectedShip={selectedShip} />
              <MyBoard
                dispatch={dispatch}
                gameChannel={gameChannel}
                selectedShip={selectedShip}
                data={game.my_board}/>
              {::this._renderError()}
            </div>
            {::this._renderOpponentBoard()}
          </section>
        </section>
        <Chat
          dispatch={dispatch}
          opponentIsConnected={::this._opponentIsConnected()}
          gameChannel={gameChannel}
          messages={messages}
          playerId={playerId}/>
      </div>
    );
  }

  _renderResultMessage() {
    const { playerId, winnerId } = this.props;

    if (playerId === winnerId) return 'Victory is yours!';
    else return 'You lose, get wrecked!';
  }

  _renderResult() {
    const { winnerId } = this.props;

    return (
      <div id="game_result" className="view-container">
        <header>
          <h1>Game over!</h1>
          <h2>{::this._renderResultMessage()}</h2>
        </header>
      </div>
    );
  }

  render() {
    const { game, gameOver } = this.props;

    if (!game) return false;
    else if (!gameOver) return this._renderGame();
    else return this._renderResult();
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
