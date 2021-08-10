import React, {useState} from 'react';
import {useHistory} from 'react-router-dom'
import {
  InputGroup,
  Input,
  Button,
  Container,
  Col
} from 'reactstrap';
import {Calendar} from './datePickerHelper'
import {formatDateForOutput} from "../../utils/utils";
import Search from "../search";

export const Bookings = () => {
  let history = useHistory();

  const [page, changePage] = useState(1);
  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [searchClick, setSearchClick] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  let middleState = {
    beginDate: beginDate,
    endDate: endDate,
    location: location,
    page: page
  };
  const handleSelectLocale = () => {
    //get current locale
    return "es"
  }

  const handleSearch = () => {
    setSearchClick(true)
    setRequestCount(requestCount + 1);
    setLocation(middleState.location);
    setBeginDate(middleState.beginDate);
    setEndDate(middleState.endDate);
    changePage(1);
    history.push('/search')
  }
  const handleLocation = (e) => {
    middleState.location = e.target.value;
    setLocation(middleState.location);
  }

  const handleBeginDate = (date) => {
    middleState.beginDate = formatDateForOutput(date);
    setBeginDate(middleState.beginDate);
  }

  const handleEndDate = (date) => {
    middleState.endDate = formatDateForOutput(date);
    setEndDate(middleState.endDate);
  }
  const handleClick = () => {
    setSearchClick(false);
  }
  return (
      <Container fluid={true} className="py-4">
        <InputGroup row className="bg-main text-light">
          <Col className="my-3" xs="12" sm="12" md="12" lg="2" xl="2">
            <h5><b><span className="text-light">Choose your</span><br/> PLAN</b></h5>
          </Col>
          <Col className="my-3" xs="12" sm="12" md="12" lg="3" xl="3">
            <label className="w-100 h-100 globe-icon rounded">
              <Input className="w-100 h-100" placeholder="Where to?" onChange={handleLocation}/>
            </label>
          </Col>
          <Col className="my-3" xs="12" sm="12" md="12" lg="3" xl="3">
            <Calendar className="date-box h-100"
                      locale={handleSelectLocale()}
                      changeDate={handleBeginDate}
            />
          </Col>
          <Col className="my-3" xs="12" sm="12" md="12" lg="3" xl="3">
            <Calendar className="date-box h-100"
                      locale={handleSelectLocale()}
                      changeDate={handleEndDate}
            />
          </Col>
          <Col className="my-3" xs="12" sm="12" md="12" lg="1" xl="1">
            <Button className="mr-4 rounded" onClick={handleSearch}><b>Search</b></Button>
          </Col>
        </InputGroup>
        {searchClick ? (
            <Search
                location={location}
                beginDate={beginDate}
                endDate={endDate}
                currentPage={page}
                count={requestCount}
                handleCLick={handleClick}
            />
        ) : ""
        }
      </Container>
  );
};
