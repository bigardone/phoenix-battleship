import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import session              from './session';
import game                 from './game';

export default combineReducers({
  routing: routerReducer,
  session: session,
  game: game,
});
