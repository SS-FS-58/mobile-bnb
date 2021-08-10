import React, {useState} from 'react';
import {Alert} from 'reactstrap';
import {API_HOST} from '../../utils/utils.js'
import axios from 'axios';

export function Register() {

  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password1: '',
    password2: ''
  });

  const [alertValues, setAlertValues] = useState({
    value: '',
    color: ''
  });

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

    axios.post(API_HOST + '/rest-auth/registration/', formValues).then(res => {
      console.log(res);

      setAlertValues({value: res.data.detail, color: 'primary'});
    })
        .catch(err => {
          if (err.response) {
            console.log("ERROR ", err.response.data);
            if (err.response.data.password1) {
              setAlertValues({value: 'Password: ' + err.response.data.password1[0], color: 'danger'});
            } else if (err.response.data.password2) {
              setAlertValues({value: 'Repeat password: ' + err.response.data.password2[0], color: 'danger'});
            } else if (err.response.data.email) {
              setAlertValues({value: 'Email: ' + err.response.data.email[0], color: 'danger'});
            } else {
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

  return (
      <div>
        {renderAlert()}
        <form class="form-signin" onSubmit={submitForm}>
          <h1 class="h3 mb-3 font-weight-normal">Sign up</h1>

          <input
              class="form-control color-invert my-3"
              type="text"
              placeholder="John"
              value={formValues.firstName}
              name="firstName"
              onChange={handleInputChange}
              required
          />
          <input
              class="form-control color-invert my-3"
              type="text"
              placeholder="Doe"
              value={formValues.lastName}
              name="lastName"
              onChange={handleInputChange}
              required
          />
          <input
              class="form-control color-invert mt-1"
              type="email"
              value={formValues.email}
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
          />
          <input
              class="form-control color-invert"
              type="password"
              value={formValues.password1}
              name="password1"
              placeholder="Password"
              onChange={handleInputChange}
          />
          <input
              class="form-control color-invert mb-3 rounded"
              type="password"
              value={formValues.password2}
              name="password2"
              placeholder="Repeat password"
              onChange={handleInputChange}
          />
          <input class="btn btn-lg btn-block" type="submit" value="Sign up now!"/>
        </form>
      </div>
  );
};
