import Constants from '../constants';

const initialState = {
  game: null,
  gameChannel: null,
  selectedShip: {
    name: null,
    size: 0,
    orientation: Constants.SHIP_ORIENTATION_HORIZONTAL,
  },
  messages: [],
  readyForBattle: false,
  currentTurn: null,
};

function readyForBattle(game) {
  return game.my_board.ready && (game.opponents_board && game.opponents_board.ready);
}

function currentTurn(game) {
  if (!readyForBattle(game)) return null;

  const lastTurn = game.rounds[0];

  console.log(lastTurn);

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
        selectedShip: { ...state.selectedShip, name: null, size: 0 },
        readyForBattle: readyForBattle(action.game),
        currentTurn: currentTurn(action.game),
      };

    case Constants.GAME_PLAYER_JOINED:
      var game = { ...state.game };
      const { playerId, board } = action;

      if (game.attacker != null && game.attacker != playerId) {
        game.defender = playerId;
        game.opponents_board = board;
      }

      return { ...state, game: game };

    case Constants.GAME_ADD_MESSAGE:
      let messages = [...state.messages];
      messages.push(action.message);

      return { ...state, messages: messages };

    case Constants.GAME_SETUP_SELECT_SHIP:
      let orientation = state.selectedShip.orientation;

      if (state.selectedShip.name == action.ship.name) {
        let orientations = [Constants.SHIP_ORIENTATION_HORIZONTAL, Constants.SHIP_ORIENTATION_VERTICAL];
        const index = orientations.indexOf(state.selectedShip.orientation);
        orientations.splice(index, 1);
        orientation = orientations[0];
      }

      const ship = { ...state.selectedShip, ...action.ship, orientation: orientation };

      return { ...state, selectedShip: ship };

    case Constants.GAME_OPPONENTS_BOARD_UPDATE:
      var game = { ...state.game, opponents_board: action.board };

      return {
        ...state,
        game: game,
        readyForBattle: readyForBattle(game),
        currentTurn: currentTurn(game),
      };

    default:
      return state;
  }
}
