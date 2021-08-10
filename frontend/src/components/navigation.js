import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  Row,
  Col
} from 'reactstrap';
import {LoginModal} from './authentication/loginModal';
import {RegisterModal} from './authentication/registerModal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Logo from '../public/mobile-bnb-colored.png';
import {doLogout} from '../utils/utils';

/* promoSection is the area below first dropdwon divider common to both logged-in && logged-out states */
function promoSection(){

	return (
		<div>
		<DropdownItem divider />
		  <DropdownItem>
		    <NavLink href="/">Become a host</NavLink>
		  </DropdownItem>
		  <DropdownItem>
		    <NavLink href="/">Help</NavLink>
		  </DropdownItem>
		</div>
	);
}

export const Navigation = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Container>
      <Row>
        <Navbar dark className="bg-fade fixed-top" expand="md">
          <Col xs="10" sm="10"md="4" lg="4" xl="4">
	    <NavbarBrand href="/" id="home-link">
	      <img className="brand-logo" alt="mobile-bnb-logo"src={Logo}/>
	    </NavbarBrand>
          </Col>
	  <Col xs="2" sm="2" md="8" lg="8" xl="8">
	    <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/">Home</NavLink>
                </NavItem>
	        <UncontrolledDropdown className="align-items-center" nav inNavbar>
	          <DropdownToggle nav caret>
                    Feature
	          </DropdownToggle>
	          <DropdownMenu>
	            <DropdownItem>
	              <NavLink href="/mobiles">Mobiles Feature</NavLink> 
	            </DropdownItem>
	            <DropdownItem>
                      <NavLink href="/search">Search Feature </NavLink>
	            </DropdownItem>
	          </DropdownMenu>
	        </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="/mobiles">Booking</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/">About Us</NavLink>
                </NavItem>
                <NavbarText className="mx-2">
	          <a href="/">English <FontAwesomeIcon icon={["fas","atlas"]}/></a>
                </NavbarText>
	        <NavbarText className="mx-2">
	          
	          <a href="/">German <FontAwesomeIcon icon={["fas","atlas"]}/></a>
	        </NavbarText>
	    {props.value ? <UncontrolledDropdown className="align-items-right" nav inNavbar>
                  <DropdownToggle className="btn rounded" nav caret>
                    Signed-In 
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink href="/">Messages</NavLink> 
              	</DropdownItem>
                    <DropdownItem>
                      <NavLink href="/">Trips</NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      <NavLink href="/">AccountSettings</NavLink>
	            </DropdownItem>
	            <DropdownItem onClick={doLogout}>
	              <NavLink >Logout</NavLink>
	            </DropdownItem>
                      {promoSection()}
	            </DropdownMenu>
                </UncontrolledDropdown>
               :<UncontrolledDropdown className="align-items-right" nav inNavbar>
                  <DropdownToggle className="btn rounded" nav caret>
                    Sign in
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <LoginModal buttonLabel="Login" handler={props.handler}/> 
              	  </DropdownItem>
                    <DropdownItem>
                      <RegisterModal buttonLabel="Register"/>
                    </DropdownItem>
	            {promoSection()}
                  </DropdownMenu>
                </UncontrolledDropdown>
}
	        </Nav>
            </Collapse>
	  </Col>
        </Navbar>
      </Row>
      
    </Container>
  );
}

