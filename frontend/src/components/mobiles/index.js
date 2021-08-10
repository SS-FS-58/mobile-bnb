import React, {Component} from 'react';
import {PrivateRoute} from '../authentication/index'
import {Switch} from 'react-router-dom';
import {Create} from './create'
import {Listing} from './listing'
import EditPeriod from './editperiod.js'
import Edit from './edit'

export class Mobiles extends Component {

  render() {
    return (
        <Switch>
          <PrivateRoute path='/mobiles/create'>
            <Create/>
          </PrivateRoute>
          <PrivateRoute exact path='/mobiles/:id' children={<Edit/>}>
          </PrivateRoute>
          <PrivateRoute path="/mobiles/:id/periods" children={<EditPeriod/>}/>
          <PrivateRoute exact path='/mobiles'>
            <Listing/>
          </PrivateRoute>

        </Switch>
    );
  }
};

export default Mobiles;