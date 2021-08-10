import React from 'react';
import {Jumbotron, Container} from 'reactstrap';
import Logo from '../public/mobile-bnb-colored.png';

export const Jumbo = (props) => {
  return (
      <div id="hero-section" className="m-0 p-0">
        <Jumbotron fluid className="hero-section bg-main">
          <Container fluid>
            <h1 className="display-22 text-align-center">
              <span className="text-light">WELCOME TO </span>
              <img src={Logo} alt="mobilebnb" className="w-25 h-25"/>
            </h1>
          </Container>
        </Jumbotron>
      </div>
  );
};

