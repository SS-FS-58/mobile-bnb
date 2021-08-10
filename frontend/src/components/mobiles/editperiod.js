import {useRouteMatch} from 'react-router-dom'
import React, {useState, useEffect} from 'react';

import {Button, Row, Col} from 'reactstrap'
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {enGB} from 'date-fns/locale'
import {DateRangePicker, START_DATE, END_DATE} from 'react-nice-dates'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import moment from "moment"

import 'react-nice-dates/build/style.css'

import axios from 'axios';
import {API_HOST, getCookie} from '../../utils/utils.js'

function formatDateForOutput(storedDate) {
  return storedDate == null ? '' : moment(storedDate).format('yyyy-MM-DD');
}

const EditPeriod = () => {
  let params = useRouteMatch("/mobiles/:id").params;
  const [currentPeriod, changeCurrentPeriod] = useState(null);
  const [prevPeriod, changePrevPeriod] = useState(null);
  const mobile = params.id;
  const [calenderBeginDate, changeCalenderBeginDate] = useState(new Date());
  const [calenderEndDate, changeCalenderEndDate] = useState(new Date());
  const [period, changePeriod] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [periodMode, setPeriodMode] = useState("1");
  const [token, setToken] = useState(getCookie('my-token'))
  var formValues = {};

  useEffect(() => {
    setToken(getCookie('my-token'))
  }, [])

  useEffect(() => {
    const submit = () => {
      axios.get(API_HOST + '/periods/search?mobile='
          + mobile
          + "&begindate=" + formatDateForOutput(calenderBeginDate)
          + "&enddate=" + formatDateForOutput(calenderEndDate),
          {headers: {Authorization: `Token ${getCookie('my-token')}`}}
      ).then(res => {
        console.log(res);
        changePeriod(res.data.results)
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
  }, [mobile, calenderBeginDate, calenderEndDate])

  const makeFormValues = () => {
    formValues = {
      start: formatDateForOutput(startDate),
      end: formatDateForOutput(endDate),
      mobile: mobile,
      id: currentPeriod ? currentPeriod.id : ''
    };
  }

  const getPeriodUrl = (mode) => {
    if (mode === "1")
      return "/mobiles/" + mobile + "/periods/1/";
    else if (mode === "0")
      return "/mobiles/" + mobile + "/periods/2/";
    return "";
  }

  const getSwitchPeriodMode = (mode) => {
    if (mode === "1")
      return "0";
    else if (periodMode === "0")
      return "1";
  }

  const checkPossibilityAddUpdate = (id) => {

    return axios.get(API_HOST + '/periods/valid?mobile=' + mobile
        + "&begindate=" + formatDateForOutput(startDate)
        + "&enddate=" + formatDateForOutput(endDate)
        + "&mode=" + periodMode
        + "&periodid=" + id,
        {headers: {Authorization: `Token ${token}`}}
    ).then((res) => {
      return res.data.results.valid;
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

  const checkModeChanged = () => {
    if (!currentPeriod)
      return false;
    console.log(currentPeriod.title, periodMode)
    if (currentPeriod.title === "Availability" && parseInt(periodMode) === 0)
      return true;

    return currentPeriod.title === "Blocking" && parseInt(periodMode) === 1;


  }

  const updatePeriodMode = () => {

    let url = getPeriodUrl(getSwitchPeriodMode(periodMode));
    makeFormValues();
    axios.get(API_HOST + "/periods/delete?mobile=" + mobile,
        {headers: {Authorization: `Token ${token}`}}).then(res => {
      if (res.data.status === 'success') {
      }
    })

    url = getPeriodUrl(periodMode);

    axios.post(API_HOST + url,
        formValues,
        {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res)
      if (res.statusText === 'Created') {
        let tempPeriod = [
          res.data
        ];
        changePeriod(tempPeriod);
      }
    })
  }

  const addPeriod = async () => {
    let isValid = await checkPossibilityAddUpdate(0);

    if (!isValid) {
      alert('Invalid adding. Check Begin date and end date!')
      return;
    }
    if (startDate == null || endDate == null) {
      alert('Please set period to add!')
      return;
    }
    let url = getPeriodUrl(periodMode);
    if (url === "") {
      alert('Please select period mode!')
      return;
    }
    makeFormValues();
    axios.post(API_HOST + url,
        formValues,
        {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res)
      if (res.statusText === 'Created') {
        res.data.start =  res.data.start + " 00:00:00"
        res.data.end =  res.data.end + " 23:59:00"
        let temp = [...period,
          res.data
        ];
        changePeriod(temp);
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

  const updatePeriod = async () => {

    if (currentPeriod == null) {
      alert('Please select period to update!')
      return;
    }
    let url = getPeriodUrl(periodMode);
    if (url === "") {
      alert('Please select period mode!')
      return;
    }
    if (checkModeChanged()) {
      confirmAlert({
        title: 'Confirm to update',
        message: 'Are you sure to update period with other mode\n The periods of current mode will be deleted.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => updatePeriodMode()
          },
          {
            label: 'No',
            onClick: () => ''
          }
        ]
      });
      return;
    }

    let isValid = await checkPossibilityAddUpdate(currentPeriod.id);
    if (!isValid) {
      alert('Invalid updating. Check Begin date and end date!')
      return;
    }

    makeFormValues();
    axios.put(API_HOST + url + formValues.id + "/",
        formValues,
        {headers: {Authorization: `Token ${token}`}}).then(res => {
      console.log(res)
      if (res.statusText === 'OK') {
        let temp = [...period];
        let tempkeys = temp.keys()
        for (const key of tempkeys) {
          if (parseInt(temp[key].id) === parseInt(currentPeriod.id)) {
            temp[key].start = formatDateForOutput(startDate)+ " 00:00:00"
            temp[key].end = formatDateForOutput(endDate)+ " 23:59:00"
            break;
          }
        }
        changePeriod(temp);
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

  const deletePeriod = () => {
    if (currentPeriod == null) {
      alert('Please select period to delete!')
      return
    }
    let url = getPeriodUrl(periodMode);
    if (url === "") {
      alert('Please select period mode!')
      return
    }
    makeFormValues();

    axios.delete(API_HOST + url + formValues.id + "/",
        {headers: {Authorization: `Token ${token}`}}).then(res => {
      if (res.data.status === 'success') {

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
    let temp = [...period];
    let tempkeys = temp.keys()
    for (const key of tempkeys) {
      if (parseInt(temp[key].id) === parseInt(currentPeriod.id)) {
        temp.splice(key, 1);
        break;
      }
    }
    changePeriod(temp);
    alert("Success to delete!")
  }

  const handleClick = (arg) => {
    if (prevPeriod) {
      prevPeriod.setProp('backgroundColor', '#007BFF');
    }
    changeCurrentPeriod(arg.event);
    arg.event.setProp('backgroundColor', '#FF6600');
    changePrevPeriod(arg.event)
    setStartDate(arg.event.start);
    setEndDate(arg.event.end);

    if (arg.event.title === "Availability")
      setPeriodMode("1");
    else
      setPeriodMode("0");
  }

  const handleSelect = (evt) => {
    setPeriodMode(evt.target.value);
  }

  return (
      <div style={{width: '70%', margin: 'auto'}}>
        <Row>
          <Col md="6" className="text-left pb-5 mt-4 "><h3 className="font-weight-bold">Edit Period</h3></Col>
        </Row>
        <Row>
          <Col md="3" className="d-flex justify-content-left">
            <h6 className="mr-2">Period Mode:</h6>
            <input type="radio"
                   className="mt-1 mr-2"
                   value="1"
                   name="mode"
                   checked={parseInt(periodMode)}
                   onChange={handleSelect}
            /> <span className="mr-3">Availability</span>
            <input type="radio"
                   value="0"
                   name="mode"
                   className="mt-1 mr-2"
                   checked={!parseInt(periodMode)}
                   onChange={handleSelect}
            /> <span>Blocking</span>
          </Col>
          <Col md="6" className="d-flex justify-content-end">
            <Row>
              <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  minimumDate={new Date("01/01/2000")}
                  minimumLength={1}
                  format='yyyy-MM-dd'
                  locale={enGB}
              >
                {({startDateInputProps, endDateInputProps, focus}) => (
                    <div className='date-range'>
                      <input
                          className={'input' + (focus === START_DATE ? ' -focused' : '')}
                          {...startDateInputProps}
                          placeholder='Checkin date'
                      />
                      <span className='date-range_arrow'/>
                      <input
                          className={'input' + (focus === END_DATE ? ' -focused' : '')}
                          {...endDateInputProps}
                          placeholder='Checkout date'
                      />
                    </div>
                )}
              </DateRangePicker>
            </Row>
          </Col>
          <Col md="3">
            <Button className="mr-2" onClick={() => addPeriod()}>Add</Button>
            <Button className="mr-2" onClick={() => updatePeriod()}>Update</Button>
            <Button onClick={() => deletePeriod()}>Delete</Button>
          </Col>
        </Row>
        <Row>
          <Col md="12" className="mt-3">
            <Row>
              <Col md="12" className="text-center">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    displayEventTime={false}
                    events={period}
                    datesSet={(arg) => {
                      changeCalenderBeginDate(arg.start);
                      changeCalenderEndDate(arg.end);
                    }}
                    eventClick={(arg) => {
                      handleClick(arg);
                    }
                    }
                >
                </FullCalendar>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
  );
};

export default EditPeriod 