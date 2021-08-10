import React, {useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap'

import 'react-nice-dates/build/style.css'

import axios from 'axios';
import Pagination from "react-js-pagination";
import {API_HOST, getCookie} from '../../utils/utils'
import {Link} from 'react-router-dom';

const Search = (props) => {
  let {beginDate, endDate, location, currentPage, count, handleCLick} = props;
  const [data, changeData] = useState(null);
  const [page, changePage] = useState(currentPage);
  // const [allowedUsers, changeAllowedUsers] = useState([]);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const submit = (page) => {
      let token = getCookie('my-token');
      axios.get(API_HOST + '/mobiles/search?location='
          + location + "&page=" + page
          + "&begindate=" + beginDate
          + "&enddate=" + endDate,
          {headers: {Authorization: `Token ${token}`}}).then(res => {
        console.log(res);
        changeData(res.data)
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
    checkIfOwner()
    submit(page);
  }, [location, page, beginDate, endDate, count])

  const handlePage = (value) => {
    changePage(value);
  }

  const checkIfOwner = () => {
    let token = getCookie('my-token');

    axios.get(API_HOST + '/rest-auth/user/', {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log("userinfo", res.data)
      setUserId(res.data.id);
      // axios.get(API_HOST + '/user/getpossibleusers?user=' + res.data.id, {headers: {Authorization: `Token ${token}`}}).then(res => {
      //   changeAllowedUsers(res.data.users)
      // });
    });
  }

  const checkHasPermission = (uid) => {
    if (userId === uid) return true;

    // for (let i = 0; i < allowedUsers.length; i++) {
    //   if (parseInt(allowedUsers[i].master_user_id) === parseInt(uid)) return true;
    // }
    return false;
  }
  return (
      <div style={{width: '80%', margin: 'auto'}} className="py-5 text-left">
        <Col md="12" className="mt-3">
          <Row>
            <Col md="2" className="text-center"><h5>User Id</h5></Col>
            <Col md="3"><h5>Name</h5></Col>
            <Col md="5" className="text-center"><h5>Description</h5></Col>
            <Col md="2" className=""><h5>Location</h5></Col>
          </Row>
          {data ? data.mobiles.map((item, idx) => (
                  checkHasPermission(item.user) ?
                      <Link to={`/mobiles/${item.id}`} onClick={() => handleCLick()}>
                        <Row key={idx} className="pt-2 pb-2" style={{borderBottom: 'solid 1px #eeeeee'}}>
                          <Col md="2" className="text-center">{item.user}</Col>
                          <Col md="3">{item.name}</Col>
                          <Col md="5" className="">{item.description}</Col>
                          <Col md="2" className="">{item.location}</Col>

                        </Row>
                      </Link> :
                      <Row key={idx} className="pt-2 pb-2" style={{borderBottom: 'solid 1px #eeeeee'}}>
                        <Col md="2" className="text-center">{item.user}</Col>
                        <Col md="3">{item.name}</Col>
                        <Col md="5" className="">{item.description}</Col>
                        <Col md="2" className="">{item.location}</Col>

                      </Row>
              ))
              : <p className="mt-4">No data</p>}
        </Col>
        <Col md="12" className="d-flex justify-content-center mt-4">
          <Pagination
              activePage={page}
              itemsCountPerPage={10}
              totalItemsCount={data && data.totalItems}
              pageRangeDisplayed={5}
              onChange={handlePage}
              itemClass="page-item"
              linkClass="page-link"
          />
        </Col>
      </div>
  );
};

export default Search;
