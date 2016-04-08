import Constants from '../constants';

const initialState = {
  game: null,
  gameChannel: null,
  selectedShip: {
    name:null,
    size: 0,
    orientation: Constants.SHIP_ORIENTATION_HORIZONTAL,
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.GAME_SET_CHANNEL:
      return { ...state, gameChannel: action.channel };

    case Constants.GAME_SET_GAME:
      return { ...state, game: action.game, selectedShip: initialState.selectedShip };

    case Constants.GAME_ADD_MESSAGE:
      let messages = [...state.game.messages];
      messages.push(action.message);

      let newGame = { ...state.game, messages: messages };

      return { ...state, game: newGame };

    case Constants.GAME_SETUP_SELECT_SHIP:
      const ship = { ...state.selectedShip, ...action.ship };
      return { ...state, selectedShip: ship };

    default:
      return state;
  }
}
