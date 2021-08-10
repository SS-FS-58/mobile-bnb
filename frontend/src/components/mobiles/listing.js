import React, {Component} from 'react';
import axios from 'axios';
import {API_HOST, getCookie} from '../../utils/utils'
import {Button} from 'reactstrap';
import {Link} from 'react-router-dom';

export class Listing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: [],
      userId: 0,
    }
  }

  getListing = () => {
    let token = getCookie('my-token');
    axios.get(API_HOST + '/mobiles/', {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res);

      this.setState({
        listing: res.data.results
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

  checkIfOwner = () => {
    let token = getCookie('my-token');

    axios.get(API_HOST + '/rest-auth/user/', {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res.data)
      this.setState({userId: res.data.id});
    });
  }

  componentDidMount = () => {
    this.getListing();
    this.checkIfOwner()
  }

  render() {
    return (
        <div style={{width: '80%', margin: 'auto'}} className="text-left">
          <h1 className="h2 mb-3 mt-5 font-weight-bold">Mobile Listing</h1>
          <Link to="/mobiles/create">
            <Button color="primary" className="my-3">Add new Mobile</Button>
          </Link>
          <ul>{this.state.listing.map((mobile) => (
              <li key={mobile.name} className="mb-3">
                <h3>{mobile.name}</h3>
                <h6>Description: {mobile.description}</h6>
                <h6>Location: {mobile.location}</h6>
                {this.state.userId === mobile.user && (
                    <Link to={`/mobiles/${mobile.id}`} className="mr-3">
                      <Button color="primary">Edit Mobile</Button>
                    </Link>
                )}
              </li>
          ))}
          </ul>
        </div>
    );
  }
};

export default Listing;