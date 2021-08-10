import React, {useState} from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  NavLink,
  Input,
  Label
} from 'reactstrap';

import {Register} from './register';


export const RegisterModal = (props) => {
  const {
    className
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
      <NavLink>
        <Button onClick={toggle}>Register</Button>
        <Modal isOpen={modal} fade={false} toggle={toggle} className={className}>
          <ModalHeader toggle={toggle} className="bg-main"><h2>Register</h2></ModalHeader>
          <ModalBody className="bg-main">
            <Register/>
          </ModalBody>
          <ModalFooter className="bg-main">
            <p className="text-muted">
              Mobilebnb will send you members-only deals, inspiration, marketing e-mails, and push notifications.
              <br/>
              You can opt out of receiving these at any time in your account settings or directly from the marketing
              notification.
            </p>
            <FormGroup check>
              <Input type="checkbox" name="marketingCheck" id="marketingCheck"/>
              <Label for="marketingCheck" check className="label-dark">Opt-out</Label>
            </FormGroup>
          </ModalFooter>
        </Modal>
      </NavLink>
  );
}

export default RegisterModal;

