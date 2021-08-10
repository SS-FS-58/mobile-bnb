import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const CarAtlasStack = () => {
  return (
    <div>
      <p><FontAwesomeIcon icon={['fas','car-side']} size="3x"/></p>
      <h5>Fully Customizable</h5>
      <p>Utilizing state of the art technologies to book your mobilebnb today.</p>
    </div>
  );
}

export const CarAtlas = (props) => {
  return (
    <Container fluid={true} className="text-dark mt-3 pt-4">
      <Row xs="1" sm="2" md="4" lg="4" xl="4">
        <Col><CarAtlasStack/></Col>
        <Col><CarAtlasStack/></Col>
        <Col><CarAtlasStack/></Col>
        <Col><CarAtlasStack/></Col>
      </Row>
      <Row xs="1" sm="1" md="2" lg="2" xl="2">
	  <Col><h3 className="text-align-left pl-4">Car-Atlas</h3></Col>
	  <Col className="align-items-right text-align-right"><Button href="/mobiles">Economy Mobiles</Button></Col>
      </Row>
    </Container>
  );
}

export default CarAtlas;
