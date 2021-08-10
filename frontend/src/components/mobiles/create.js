import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {API_HOST, getCookie} from '../../utils/utils'
import {
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  FormText,
  Alert
} from 'reactstrap';

export class Create extends Component {
  constructor(props) {
    super(props);

    let token = getCookie('my-token');
    this.state = {
      formValues: {
        authToken: token,
        name: '',
        description: '',
        user: '',
        photos: [],
      },
      alertValues: {
        value: '',
        color: ''
      },
      mobile: ""
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    });
  };

  addMobile = (event) => {
    event.preventDefault();

    axios.get(API_HOST + '/rest-auth/user/', {headers: {Authorization: `Token ${this.state.formValues.authToken}`}}).then(res => {
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

      axios.post(API_HOST + '/mobiles/', this.state.formValues, {headers: {Authorization: `Token ${this.state.formValues.authToken}`}}).then(res => {
        console.log(res);
        this.setState({
          alertValues: {value: 'Successfully created new mobile listing', color: 'primary'}
        });
        this.setState({
          mobile: res.data.id
        })
      })
          .catch(err => {
            if (err.response) {
              console.log("ERROR ", err.response.data);
              if (err.response.data.name) {
                this.setState({
                  alertValues: {value: 'Name:' + err.response.data.name, color: 'danger'}
                });
              } else {
                this.setState({
                  alertValues: {value: 'Description:' + err.response.data.description, color: 'danger'}
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

  renderAlert = () => {
    if (this.state.alertValues.value !== '') {
      return <Alert color={this.state.alertValues.color}>{this.state.alertValues.value}</Alert>
    }
  }

  viewEditPeriod = () => {
    if (this.state.mobile !== '') {
      // return <EditPeriod/>
      return <h3><Link to={`/mobiles/${this.state.mobile}`}><Button color="primary">Edit Periods</Button></Link></h3>
    }
  }

  render() {
    return (
        <div style={{width: '80%', margin: 'auto'}} className="text-left py-5">
          {this.renderAlert()}
          {this.viewEditPeriod()}
          <h3 className="font-weight-bold mb-5">Create Mobile</h3>
          <Form>
            <FormGroup>
              <Label for="mobileName">Name</Label>
              <Input
                  type="text"
                  name="name"
                  id="mobileName"
                  placeholder="Cool new mobile in Neverland"
                  onChange={this.handleInputChange}
                  required
              />
            </FormGroup>
            <FormGroup>
              <Label for="mobileDescription">Description</Label>
              <Input type="textarea" name="description" id="mobileDescription" onChange={this.handleInputChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="mobileLocation">location</Label>
              <Input type="textarea" name="location" id="mobileLocation" onChange={this.handleInputChange}/>
            </FormGroup>
            <FormGroup>
              <Label for="mobilePhoto">Picture</Label>
              <Input type="file" name="photos" onChange={this.handleInputChange} id="mobilePhoto"
                     accept="image/png, image/jpeg" multiple required/>
              <FormText color="muted">
                Upload JPEG or PNG file formats (WARNING: still not implemented)
              </FormText>
            </FormGroup>
            <Button className="mt-3" onClick={this.addMobile}>Submit</Button>
          </Form>
        </div>
    );
  }
};

export default Create;