import React, { Component } from 'react';
import Header from './components/header'
import Content from './components/content'
import Footer from './components/footer'
import { BrowserRouter as Router } from 'react-router-dom';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import { isAuthenticated } from './utils/utils';
library.add(fas, faCalendarAlt)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogInActive: isAuthenticated(),
    };

    this.handler = this.handler.bind(this)
  }

  handler = (val) => {
    this.setState({
      isLogInActive: val
    });
  }

  render() {
    const { isLogInActive } = this.state;
    return (
      <div>
        <Router>
          <Header value={isLogInActive} handler={this.handler} />
          <Content value={isLogInActive} />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
