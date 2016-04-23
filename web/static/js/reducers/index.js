import { combineReducers }  from 'redux';
import { routerReducer }    from 'react-router-redux';
import session              from './session';
import home                 from './home';
import game                 from './game';

export default combineReducers({
  routing: routerReducer,
  session: session,
  home: home,
  game: game,
});
