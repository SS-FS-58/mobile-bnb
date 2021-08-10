import React, { Component } from 'react';
import axios from 'axios';
import { API_HOST, getCookie } from '../../utils/utils'
import {
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormText,
  Alert
} from 'reactstrap';


export class Mobile extends Component {
  constructor(props) {
    super(props);

    let token = getCookie('my-token');
    this.state = {
      mobileData: this.props.location.state,
      userId: null,
      editView: null,
      formValues: {
        authToken: token,
        name: '',
        description: '',
        photos: []
      },
      alertValues: {
        value: '',
        color: ''
      }
    }
  }

  renderAlert = () => {
    if (this.state.alertValues.value !== '') {
      return <Alert color={this.state.alertValues.color}>{this.state.alertValues.value}</Alert>
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'file' ? target.files : target.value;
    const name = target.name;

    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    });
  };

  editMobile = (event) => {
    event.preventDefault();

    axios.get(API_HOST + '/rest-auth/user/', { headers: { Authorization: `Token ${this.state.formValues.authToken}` } }).then(res => {
      console.log(res.data)
      this.setState({
        formValues: {
          ...this.state.formValues,
          user: res.data.id
        }
      });

      const formData = new FormData();

      Array.from(this.state.formValues.photos).forEach(image => {
        formData.append('photos', image);
      });

      formData.append('authToken', this.state.formValues.authToken);
      formData.append('name', this.state.formValues.name);
      formData.append('description', this.state.formValues.description);
      formData.append('user', this.state.formValues.user);


      axios.patch(API_HOST + '/mobiles/' + this.state.mobileData.id + '/', formData, { headers: { Authorization: `Token ${this.state.formValues.authToken}`, "Content-Type": "multipart/form-data" } }).then(res => {
        console.log(res);
        this.setState({
          alertValues: { value: 'Successfully updated mobile listing', color: 'primary' }
        });
      })
        .catch(err => {
          if (err.response) {
            console.log("ERROR ", err.response.data);
            if (err.response.data.name) {
              this.setState({
                alertValues: { value: 'Name:' + err.response.data.name, color: 'danger' }
              });
            } else if (err.response.data.photos) {
              this.setState({
                alertValues: { value: 'Photos:' + err.response.data.photos, color: 'danger' }
              });
            } else {
              this.setState({
                alertValues: { value: 'Description:' + err.response.data.description, color: 'danger' }
              });
            }

          } else if (err.request) {
            console.log("ERROR ", err.request);
          } else {
            console.log("Bad Request");
          }
        })
    })
  }


  checkIfOwner = () => {
    let token = getCookie('my-token');

    axios.get(API_HOST + '/rest-auth/user/', { headers: { Authorization: `Token ${token}` } }).then(res => {
      console.log(res.data)
      this.setState({ userId: res.data.id });
    });
  }

  editableView = () => {
    this.setState({
      editView: <Form>
        <FormGroup>
          <Label for="mobileName">Name</Label>
          <Input
            type="text"
            name="name"
            id="mobileName"
            onChange={this.handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobileDescription">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="mobileDescription"
            onChange={this.handleInputChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="mobilePhoto">Picture</Label>
          <Input type="file" name="photos" onChange={this.handleInputChange} id="mobilePhoto" accept="image/png, image/jpeg" multiple required />
          <FormText color="muted">
            Upload JPEG or PNG file formats (WARNING: still not implemented)
                </FormText>
        </FormGroup>
        <Button onClick={this.editMobile}>Change</Button>
      </Form>
    });
  }

  componentDidMount = () => {
    this.checkIfOwner();
  }

  render() {
    let button;
    if (this.state.userId === this.state.mobileData.user) {
      button = <Button color="primary" onClick={this.editableView}>Edit Mobile</Button>
    }
    return (

      <div>
        <h2>{this.state.mobileData.name}</h2>
        <p>{this.state.mobileData.description}</p>
        {button}
        {this.state.editView}
      </div>
    );
  }
};

export default Mobile;