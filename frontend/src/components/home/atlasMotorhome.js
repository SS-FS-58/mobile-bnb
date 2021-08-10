import React from 'react';
import {Container, Row, Col} from 'reactstrap';
import CityCamper from '../../public/citycamper.jpg';

export const AtlasMotorhome = (props) => {
  return (
      <Container fluid={true} className="bg-atlas text-light mb-5">
        <Row className="bg-fade" xs="2" sm="2" md="2" lg="2">
          <Col>
            <img className="rounded-extra my-5 border-extra img-reduce img-fluid" src={CityCamper} alt="City camper"/>
          </Col>
          <Col className="my-5 px-2">
            <Row><h2>ATLAS-MOTORHOME</h2></Row>
            <Row><p>Quick description</p></Row>
            <Row>
              <ul>
                <li>Bullets</li>
                <li>Bullets</li>
                <li>Bullets</li>
              </ul>
            </Row>
          </Col>
        </Row>
      </Container>
  );
}

export default AtlasMotorhome;
