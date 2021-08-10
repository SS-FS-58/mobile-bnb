import React, {useState, useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom'
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

const Edit = () => {
  let mobileId = useRouteMatch("/mobiles/:id").params.id;
  let token = getCookie('my-token');
  const [formValues, setFormValues] = useState({});
  const [alertValues, setAlertValues] = useState({});
  const [mobile] = useState(mobileId);

  useEffect(() => {
    const submit = () => {
      let token = getCookie('my-token');
      axios.get(API_HOST + '/mobiles/' + mobile + '/',
          {headers: {Authorization: `Token ${token}`}}
      ).then(res => {
        if (res.statusText === "OK") {
          setFormValues(res.data)
          console.log(res.data)
        }
      })
          .catch(err => {
            if (err.response) {
              console.log("ERROR ", err.response.data);
            } else if (err.request) {
              console.log("ERROR ", err.request);
            } else {
              console.log("Bad Request");
            }
          });
    }
    submit()
  }, [mobile])

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let temp = {...formValues};
    temp[name] = value;
    setFormValues(temp);
  };

  const editMobile = (event) => {
    event.preventDefault();

    axios.get(API_HOST + '/rest-auth/user/', {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res.data)
      if (res.data.is_host) {
        axios.patch(API_HOST + '/mobiles/' + formValues.id + '/', formValues, {headers: {Authorization: `Token ${token}`}}).then(res => {
          setAlertValues({value: 'Successfully updated mobile properties', color: 'primary'});
        })
            .catch(err => {
              if (err.response) {
                console.log("ERROR ", err.response.data);
                if (err.response.data.name) {
                  setAlertValues({value: 'Name:' + err.response.data.name, color: 'danger'});
                } else {
                  setAlertValues({value: 'Description:' + err.response.data.description, color: 'danger'});
                }

              } else if (err.request) {
                console.log("ERROR ", err.request);
              } else {
                console.log("Bad Request");
              }
            })
      } else {
        setAlertValues({value: 'Hosting permission setting error', color: 'danger'});
      }

    })
  }

  const renderAlert = () => {
    console.log(alertValues.value)
    if (alertValues.value && alertValues.value !== '') {
      return <Alert color={alertValues.color}>{alertValues.value}</Alert>
    }
  }
  return (
      <div style={{width: '80%', margin: 'auto'}} className="text-left py-5">
        {renderAlert()}
        <h3 className="font-weight-bold mb-5">Edit Mobile</h3>
        <h3><Link to={`/mobiles/${mobile}/periods`}><Button color="primary" className="my-3">Edit Periods</Button></Link></h3>
        <Form>
          <FormGroup>
            <Label for="mobileName">Name</Label>
            <Input
                type="text"
                name="name"
                id="mobileName"
                value={formValues.name}
                placeholder="Cool new mobile in Neverland"
                onChange={handleInputChange}
                required
            />
          </FormGroup>
          <FormGroup>
            <Label for="mobileDescription">Description</Label>
            <Input type="textarea" name="description" id="mobileDescription" value={formValues.description}
                   onChange={handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="mobileLocation">location</Label>
            <Input type="textarea" name="location" id="mobileLocation" value={formValues.location}
                   onChange={handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Label for="mobilePhoto">Picture</Label>
            <Input type="file" name="file" id="mobilePhoto"/>
            <FormText color="muted">
              Upload JPEG or PNG file formats (WARNING: still not implemented)
            </FormText>
          </FormGroup>
          <Button onClick={editMobile}>Update</Button>
        </Form>
      </div>
  );
};

export default Edit;