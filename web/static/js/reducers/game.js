import Constants from '../constants';

const initialState = {
  game: null,
  gameChannel: null,
  selectedShip: {
    name: null,
    size: 0,
    orientation: Constants.SHIP_ORIENTATION_HORIZONTAL,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.GAME_SET_CHANNEL:
      return { ...state, gameChannel: action.channel };

    case Constants.GAME_SET_GAME:
      var game = { ...state.game, ...action.game };

      return { ...state, game: game, selectedShip: initialState.selectedShip };

    case Constants.GAME_PLAYER_JOINED:
      var game = { ...state.game };
      const { player, board } = action;

      if (game.attacker != null && game.attacker.id != player.id) {
        game.defender = player;
        game.opponents_board = board;
      }

      return { ...state, game: game };

    case Constants.GAME_ADD_MESSAGE:
      let messages = [...state.game.messages];
      messages.push(action.message);

      let newGame = { ...state.game, messages: messages };

      return { ...state, game: newGame };

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

      return { ...state, game: game };

    default:
      return state;
  }
}
