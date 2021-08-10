import React from 'react';
import {Container, Row, Col, Button, Input} from 'reactstrap';

export const DriverDetails = (props) => {
  return (
      <Container className="bg-main text-light my-4 p-4 rounded-extra">
        <h2>DRIVER DETAILS</h2>
        <Row xs="2" sm="2" md="2" lg="2">
          <Col>
            <Row>
              <Input disabled className="my-3 mx-2" type="text" name="firstName" id="firstName"
                     placeholder="First Name"/>
            </Row>
            <Row>
              <Input disabled className="my-3 mx-2" type="text" name="age" id="age" placeholder="Age 18-60"/>
            </Row>
            <Row>
              <Input disabled className="my-3 mx-2" type="text" name="phoneNumber" id="phoneNumber"
                     placeholder="Phone Number"/>
            </Row>
          </Col>
          <Col>
            <Row>
              <Input disabled className="my-3 mx-2" type="text" name="lastName" id="lastName" placeholder="Last Name"/>
            </Row>
            <Row>
              <Input disabled className="my-3 mx-2" type="email" name="email" id="email" placeholder="Email"/>
            </Row>
            <Row><Button className="btn-rounded my-3 mx-2 ml-5 w-75">Done</Button></Row>
          </Col>
        </Row>
      </Container>
  );
}

export default DriverDetails;

