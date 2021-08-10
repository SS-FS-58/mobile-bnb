import React, {useState} from 'react';
import {Alert} from 'reactstrap';
import {API_HOST} from '../../utils/utils.js'
import axios from 'axios';
import {useHistory, useLocation} from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Col,
  Row
} from 'reactstrap';

export function Login(props) {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const [alertValues, setAlertValues] = useState({
    value: '',
    color: ''
  });

  let location = useLocation();
  let history = useHistory();
  let {from} = location.state || {from: {pathname: location.state}};

  const handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const submitForm = event => {
    event.preventDefault();

    axios.post(API_HOST + '/rest-auth/login/', formValues).then(res => {
      console.log(res);

      document.cookie = 'my-token=' + res.data.key + '; expires=0;';
      history.push(from);
      props.handler(res.data.key)
    })
        .catch(err => {
          if (err.response) {
            console.log("ERROR ", err.response.data);
            if (err.response.data.password) {
              setAlertValues({value: 'Password: ' + err.response.data.password[0], color: 'danger'});
            } else {
              console.log("ERROR ", err.response.data);
              setAlertValues({value: err.response.data.non_field_errors[0], color: 'danger'});
            }

          } else if (err.request) {
            console.log("ERROR ", err.request);
          } else {
            console.log("Bad Request");
          }
        })
  }

  const renderAlert = () => {
    if (alertValues.value !== '') {
      return <Alert color={alertValues.color}>{alertValues.value}</Alert>
    }
  }
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);
  return (
      <div>
        <Button onClick={toggle}>Login</Button>
        <Modal id="modal" isOpen={modal} fade={false} toggle={toggle}>
          <ModalHeader toggle={toggle} className="bg-main"><h3>Login</h3></ModalHeader>
          <ModalBody className="bg-main">

            {renderAlert()}
            <form className="form-signin" onSubmit={submitForm}>
              <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
              <input
                  className="form-control color-invert"
                  type="email"
                  value={formValues.email}
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
              />
              <input
                  className="form-control color-invert"
                  type="password"
                  value={formValues.password}
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
              />
              <input onClick={toggle} className="btn btn-lg btn-block" type="submit" value="Login"/>
            </form>
          </ModalBody>
          <ModalFooter className="bg-main">
            <Container>
              <Row>
                <Col>
                  <a href="/">Forgot password?</a>
                  <br/>
                </Col>
                <Col>
                  <a href="/">More login options</a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href="/register"><span>Dont have an account? </span> Sign up</a>
                </Col>
                <Col>
                  <Button color="secondary" onClick={toggle}>Cancel</Button>
                </Col>
              </Row>
            </Container>
          </ModalFooter>
        </Modal>
      </div>
  );
};
