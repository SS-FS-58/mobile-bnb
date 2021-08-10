import React, {Component} from 'react';
import axios from 'axios';
import {API_HOST, getCookie} from '../../utils/utils'
import {Button, Alert} from 'reactstrap';

export class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      userId: '',
      isHost: false,
      alertValues: {
        value: '',
        color: ''
      }
    }
  }

  getUser = () => {
    let token = getCookie('my-token');

    axios.get(API_HOST + '/rest-auth/user/', {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res);
      this.setState({
        token: token,
        userId: res.data.id,
        isHost: res.data.is_host
      });
    })
        .catch(err => {
          if (err.response) {
            console.log("ERROR ", err.response.data);
          } else if (err.request) {
            console.log("ERROR ", err.request);
          } else {
            console.log("Bad Request");
          }
        })
  }

  changeHostStatus = (event) => {
    event.preventDefault();

    let status;
    if (event.target.id === "hostButton") {
      status = true;
    } else {
      status = false
    }

    var data = new FormData();
    data.append('is_host', status);

    axios.patch(API_HOST + '/users/' + this.state.userId + '/', data, {headers: {Authorization: `Token ${this.state.token}`}}).then(res => {
      console.log(res);

      this.setState({
        alertValues: {value: 'Successfully changed user status', color: 'primary'}
      });
    })
        .catch(err => {
          if (err.response) {
            console.log("ERROR ", err.response.data);
            this.setState({
              alertValues: {value: err.response.data.name, color: 'danger'}
            });
          } else if (err.request) {
            console.log("ERROR ", err.request);
          } else {
            console.log("Bad Request");
          }
        })
  }

  componentDidMount = () => {
    this.getUser();
  }

  renderAlert = () => {
    if (this.state.alertValues.value !== '') {
      return <Alert color={this.state.alertValues.color}>{this.state.alertValues.value}</Alert>
    }
  }

  render() {
    return (
        <div>
          {this.renderAlert()}
          <Button color="primary" id="hostButton" onClick={this.changeHostStatus}>Host</Button>
          <p>or</p>
          <Button color="primary" id="guestButton" onClick={this.changeHostStatus}>Guest</Button>
        </div>
    );
  }
};

export default Settings;