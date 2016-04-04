import { IndexRoute, Route }  from 'react-router';
import React                  from 'react';
import MainLayout             from '../layouts/main';
import HomeIndexView          from '../views/home';
import NotFoundView           from '../views/errors/not_found';

export default function configRoutes(store) {
  return (
    <Route component={MainLayout}>
      <Route path="/" component={HomeIndexView}/>
      <Route path="*" component={NotFoundView} />
    </Route>
  );
}
