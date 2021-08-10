import React, {Component} from 'react';
import {Navigation} from './navigation';

class Header extends Component {
  render() {
    return (
        <div>
          <Navigation handler={this.props.handler} value={this.props.value}/>
        </div>
    )
  }
}

export default Header;
