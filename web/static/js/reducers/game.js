import Constants from '../constants';

const initialState = {
  game: null,
  channel: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.GAME_JOIN:
      return {
        ...state,
        game: action.game,
        channel: action.channel,
      };

    default:
      return state;
  }
}
