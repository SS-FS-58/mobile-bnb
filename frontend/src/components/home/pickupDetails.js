import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';


export const PickupDetails = (props) => {
  return (
    <Container className="bg-main text-light my-4 p-4 rounded-extra">
      <Row xs="2">
        <Col>
	  <Row><h3>PICK-UP</h3></Row>
	  <Row className="pb-3">Pick-Up your mobile, and enjoy your bnb today</Row>
	  <Row><h3>DROP-OFF</h3></Row>
	  <Row className="pb-3">Drop off is easy as pickup.</Row>
	</Col>
        <Col>
	  <Row><h3>PRICE SUMMARY</h3></Row>
	  <Row>
	    <ul>
	      <li>Item 1</li>
	      <li>Item 2</li>
	      <li>Item 3</li>
	    </ul>
	  </Row>
	  <Row>
	    <Col>Total Amount</Col>
	    <Col>$230</Col>
	  </Row>
	  <Row><Button className="btn-rounded my-3 mx-2 ml-5"> Book Now </Button></Row>
	</Col>
      </Row>
    </Container>
  );
}

export default PickupDetails;
