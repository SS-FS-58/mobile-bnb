import React from 'react';
import {NavLink} from 'reactstrap';
import {Login} from './login'

export const LoginModal = (props) => {
  return (
      <NavLink>
        <Login handler={props.handler}/>
      </NavLink>
  );
}

export default LoginModal;

