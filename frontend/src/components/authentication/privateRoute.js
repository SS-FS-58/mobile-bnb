import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {isAuthenticated} from '../../utils/utils';


export function PrivateRoute(props) {
  return (
      <Route render={() => {
        if (isAuthenticated()) {
          return (props.children);
        } else {
          return (
              <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
          );
        }
      }}/>
  );
};