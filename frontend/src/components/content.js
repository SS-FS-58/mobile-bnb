import React, {Component} from 'react';
import {Login, Register, PrivateRoute} from './authentication/index'
import {Settings} from './authentication/settings'
import {Mobiles} from './mobiles/index'
import {Switch, Route} from 'react-router-dom';
import EditPeriod from './period';
import {Jumbo} from './jumbotronSection';
import {Bookings} from './bookings/bookings';
import {CarAtlas} from './home/carAtlas';
import {AtlasMotorhome} from './home/atlasMotorhome';
import {DriverDetails} from './home/driverDetails';
import {PickupDetails} from './home/pickupDetails';

class Content extends Component {
  render() {
    return (
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto">
          <Jumbo className="my-0"/>
          <Bookings/>
          <Switch>
            <Route exact path='/'>
              <CarAtlas/>
              <AtlasMotorhome/>
              <DriverDetails/>
              <PickupDetails/>
            </Route>
            <Route path='/login'>
              <Login/>
            </Route>
            <Route path='/register'>
              <Register/>
            </Route>
            <PrivateRoute path='/settings'>
              <Settings/>
            </PrivateRoute>
            <PrivateRoute path='/mobiles'>
              <Mobiles/>
            </PrivateRoute>
            <Route path='/editperiod'>
              <EditPeriod/>
            </Route>
          </Switch>
        </div>
    )
  }
}

export default Content;