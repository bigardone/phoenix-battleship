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
import Instructions           from '../../components/game/instructions';

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

    if (!readyForBattle) return (
      <Instructions
        readyForBattle={readyForBattle}
        playerIsAttacker={playerId === game.attacker}/>
    );

    const opponentBoard = game.opponents_board;

    return (
      <div id="opponents_board_container">
        <header>
          <h2>Shooting grid</h2>
        </header>
        <OpponentBoard
          dispatch={dispatch}
          gameChannel={gameChannel}
          data={opponentBoard}
          playerId={playerId}
          currentTurn={currentTurn}/>
        <p>Remaining hit points: {opponentBoard.hit_points}</p>
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

  _renderResult() {
    const { playerId, winnerId } = this.props;

    const message = playerId === winnerId ?  'Yo Ho Ho, victory is yours!' : 'You got wrecked, landlubber!';
    const twitterMessage = playerId === winnerId ?  'Yo Ho Ho, I won a battle at Phoenix Battleship' : 'I got wrecked at Phoenix Battleship';

    return (
      <div id="game_result">
        <header>
          <h1>Game over</h1>
          <p>{message}</p>
          <a
            href={`https://twitter.com/intent/tweet?url=https://phoenix-battleship.herokuapp.com&button_hashtag=myelixirstatus&text=${twitterMessage}`}
            className="twitter-hashtag-button"><i className="fa fa-twitter"/> Share result</a>
        </header>
      </div>
    );
  }

  _renderGameContent() {
    const { dispatch, game, gameOver, gameChannel, selectedShip, playerId, currentTurn, messages } = this.props;

    if (gameOver) return this._renderResult();

    return (
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
    );
  }

  render() {
    const { dispatch, game, gameChannel, selectedShip, playerId, currentTurn, messages } = this.props;

    if (!game) return false;

    return (
      <div id="game_show" className="view-container">
        {::this._renderGameContent()}
        <Chat
          dispatch={dispatch}
          opponentIsConnected={::this._opponentIsConnected()}
          gameChannel={gameChannel}
          messages={messages}
          playerId={playerId}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => (
  { ...state.session, ...state.game }
);

export default connect(mapStateToProps)(GameShowView);
