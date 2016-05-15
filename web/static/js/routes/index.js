import { IndexRoute, Route }  from 'react-router';
import React                  from 'react';
import MainLayout             from '../layouts/main';
import HomeIndexView          from '../views/home';
import GameShowView           from '../views/game/show';
import NotFoundView           from '../views/errors/not_found';
import GameErrorView           from '../views/errors/game_error';

export default function configRoutes(store) {
  return (
    <Route component={MainLayout}>
      <Route path="/" component={HomeIndexView}/>
      <Route path="/game/:id" component={GameShowView}/>
      <Route path="/not_found" component={NotFoundView} />
      <Route path="/game_error" component={GameErrorView} />
      <Route path="*" component={NotFoundView} />
    </Route>
  );
}
