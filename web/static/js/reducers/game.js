import Constants from '../constants';

const initialState = {
  game: null,
  gameChannel: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.GAME_SET_CHANNEL:
      return { ...state, gameChannel: action.channel };

    case Constants.GAME_SET_GAME:
      return { ...state, game: action.game };

    case Constants.GAME_ADD_MESSAGE:
      let messages = [...state.game.messages];
      messages.push(action.message);

      let newGame = { ...state.game, messages: messages };

      return { ...state, game: newGame };

    default:
      return state;
  }
}
