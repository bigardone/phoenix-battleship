import Constants from '../constants';

const initialState = {
  game: null,
  gameChannel: null,
  selectedShip: {
    id: null,
    size: 0,
    orientation: Constants.SHIP_ORIENTATION_HORIZONTAL,
  },
  messages: [],
  readyForBattle: false,
  gameOver: false,
  winnerId: null,
  currentTurn: null,
  error: null,
};

function readyForBattle(game) {
  return game.my_board.ready && (game.opponents_board != undefined && game.opponents_board.ready);
}

function currentTurn(game) {
  if (!readyForBattle(game)) return null;

  const lastTurn = game.turns[0];

  if (lastTurn == undefined) {
    return game.attacker;
  } else {
    return [game.attacker, game.defender].find((player) => player != lastTurn.player_id);
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.GAME_SET_CHANNEL:
      return { ...state, gameChannel: action.channel };

    case Constants.GAME_SET_GAME:
      var game = { ...state.game, ...action.game };

      return {
        ...state,
        game: game,
        selectedShip: { ...state.selectedShip, id: null, size: 0, orientation: Constants.SHIP_ORIENTATION_HORIZONTAL },
        readyForBattle: readyForBattle(game),
        currentTurn: currentTurn(game),
        error: null,
      };

    case Constants.GAME_PLAYER_JOINED:
      var game = { ...state.game };
      const { playerId, board } = action;

      if (game.attacker != null && game.attacker != playerId) {
        game.defender = playerId;
        game.opponents_board = board;
      }

      return { ...state, game: game };

    case Constants.GAME_PLAYER_LEFT:
      var game = { ...state.game };

      if (game.attacker === action.playerId) game.attacker = null;
      if (game.defender === action.playerId) game.defender = null;

      return { ...state, game: game };

    case Constants.GAME_ADD_MESSAGE:
      let messages = [...state.messages];
      messages.push(action.message);

      return { ...state, messages: messages };

    case Constants.GAME_SETUP_SELECT_SHIP:
      let orientation = state.selectedShip.orientation;

      if (state.selectedShip.id == action.ship.id) {
        let orientations = [Constants.SHIP_ORIENTATION_HORIZONTAL, Constants.SHIP_ORIENTATION_VERTICAL];
        const index = orientations.indexOf(state.selectedShip.orientation);
        orientations.splice(index, 1);
        orientation = orientations[0];
      }

      const ship = { ...state.selectedShip, ...action.ship, orientation: orientation };

      return { ...state, selectedShip: ship, error: null };

    case Constants.GAME_OPPONENTS_BOARD_UPDATE:
      var game = { ...state.game, opponents_board: action.board };

      return {
        ...state,
        game: game,
        readyForBattle: readyForBattle(game),
        currentTurn: currentTurn(game),
      };

    case Constants.GAME_OVER:
      return state.gameOver ? { ...state, game: action.game } : { ...state, game: action.game, gameOver: true, winnerId: action.game.winner };

    case Constants.GAME_ERROR:
      return { ...state, error: action.error };

    case Constants.GAME_RESET:
      let { gameChannel } = state;
      if (gameChannel != null) gameChannel.leave();

      return { ...initialState };

    default:
      return state;
  }
}
