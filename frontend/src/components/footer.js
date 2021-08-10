import React, { Component } from 'react';

import {Container, Row,Col} from 'reactstrap';

class Footer extends Component {
    render() {
        return (
	       
		<Container fluid className="bg-main text-light mt-3 p-4">
		  <Row>
		    <Col/>
		    <Col className="px-3" xs="3" sm="3" md="3" lg="3" xl="3">
		      <Row><h3 className="baus93">About Us</h3></Row>
		      <Row><p>Detailing about us..</p></Row>
		    </Col>
		    <Col className="px-3" xs="3" sm="3" md="3" lg="3" xl="3">
		      <Row><h3 className="baus93">Get in Touch</h3></Row>
		      <Row><p>Address</p></Row>
		      <Row><p>Phone</p></Row>
		      <Row><p>Email</p></Row>
		    </Col>
		    <Col className="px-3" xs="3" sm="3" md="3" lg="3" xl="3">
		      <Row><h3 className="baus93">Social Media</h3></Row>
		      <Row><p>Stay tuned for updates!</p></Row>
		      <Row><p>Breadcrumb social inks</p></Row>
		    </Col>
		    <Col/>
		  </Row>
		</Container>
        )
    }
}

export default Footer;

