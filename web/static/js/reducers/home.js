import Constants from '../constants';

const initialState = {
  currentGames: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.HOME_SET_CURRENT_GAMES:
      return { ...initialState, currentGames: action.games };
    default:
      return initialState;
  }
}
