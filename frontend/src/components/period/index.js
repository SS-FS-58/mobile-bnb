import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Button, Row, Col } from 'reactstrap'
import { enGB } from 'date-fns/locale'
import { DateRangePicker, START_DATE, END_DATE } from 'react-nice-dates'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import moment from "moment"

import 'react-nice-dates/build/style.css'

import axios from 'axios';
import { API_HOST, getCookie } from '../../utils/utils.js'

let token = getCookie('my-token');

function formatDateForOutput(storedDate) {
    return storedDate == null ? '' : moment(storedDate).format('yyyy-MM-DD');
}

const EditPeriod = () => {
    const [currentPeriod, changeCurrentPeriod] = useState(null);
    const [prevPeriod, changePrevPeriod] = useState(null);
    const query = new URLSearchParams(useLocation().search);
    const mobileid = query.get("mobile");
    const mode = query.get("mode");
    const [calenderBeginDate, changeCalenderBeginDate] = useState(new Date());
    const [calenderEndDate, changeCalenderEndDate] = useState(new Date());
    const [period, changePeriod] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {

        const submit = () => {
            axios.get(API_HOST + '/periods/list?mobile='
                + mobileid
                + "&mode=" + mode
                + "&begindate=" + formatDateForOutput(calenderBeginDate)
                + "&enddate=" + formatDateForOutput(calenderEndDate),
                { headers: { Authorization: `Token ${token}` } }
            ).then(res => {
                // console.log(res);
                let changedPeriods = res.data.periods.map(period => ({
                    ...period,
                    end: moment(period.end).add(1, 'day').subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss.SSS')
                }))
                console.log(changedPeriods, "==== changed periods")
                changePeriod(changedPeriods)
                // changePeriod(res.data.periods)
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
    }, [mobileid, mode, calenderBeginDate, calenderEndDate])

    const addPeriod = () => {
        if (startDate == null || endDate == null) {
            alert('Please set period to add!')
            return
        }
        axios.get(API_HOST + '/periods/add?mobile='
            + mobileid
            + "&mode=" + mode
            + "&begindate=" + formatDateForOutput(startDate)
            + "&enddate=" + formatDateForOutput(endDate),
            { headers: { Authorization: `Token ${token}` } }).then(res => {
                console.log(period)
                if (res.data.status === 'success') {
                    let temp = [...period,
                    {
                        id: res.data.id,
                        title: res.data.text,
                        start: formatDateForOutput(startDate),
                        end: formatDateForOutput(endDate)
                    }];
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

    const updatePeriod = () => {
        if (currentPeriod == null) {
            alert('Please select period to update!')
            return
        }
        
        axios.get(API_HOST + '/periods/update?periodid='
            + currentPeriod.id
            + "&begindate=" + formatDateForOutput(startDate)
            + "&enddate=" + formatDateForOutput(endDate),
            { headers: { Authorization: `Token ${token}` } }).then(res => {
                console.log(period)
                if (res.data.status === 'success') {
                    let temp = [...period];
                    var tempkeys = temp.keys()
                    for (const key of tempkeys) {
                        if(temp[key].id === currentPeriod.id){
                            temp[key].start = formatDateForOutput(startDate)
                            temp[key].end = formatDateForOutput(endDate)
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
        axios.get(API_HOST + '/periods/delete?periodid='
            + currentPeriod.id,
            { headers: { Authorization: `Token ${token}` } }).then(res => {
                if (res.data.status === 'success') {
                    let temp = [...period];
                    var tempkeys = temp.keys()
                    for (const key of tempkeys) {
                        if(temp[key].id === currentPeriod.id){
                            temp.splice(key, 1);
                            break;                        
                        }
                    }
                    changePeriod(temp);
                    alert("Success to delete!")
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

    const handleClick = (arg) => {
        if (prevPeriod) {
            prevPeriod.setProp('backgroundColor', '#007BFF');
        }
        changeCurrentPeriod(arg.event);
        arg.event.setProp('backgroundColor', '#FF6600');
        changePrevPeriod(arg.event)
        setStartDate(arg.event.start);
        setEndDate(arg.event.end);
    }

    return (
        <div style={{ width: '80%', margin: 'auto' }}>
            <Row>
                <Col md="6"><h3>Edit Period</h3></Col>
            </Row>
            <Row>
                <Col md="3" className="d-flex justify-content-left"><h4>Period Mode:{mode === 'true' ? 'Available' : 'Blocking'}</h4></Col>
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
                            {({ startDateInputProps, endDateInputProps, focus }) => (
                                <div className='date-range'>
                                    <input
                                        className={'input' + (focus === START_DATE ? ' -focused' : '')}
                                        {...startDateInputProps}
                                        placeholder='Checkin date'
                                    />
                                    <span className='date-range_arrow' />
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
                <Col md="1"><Button onClick={() => addPeriod()}>Add</Button></Col>
                <Col md="1"><Button onClick={() => updatePeriod()}>Update</Button></Col>
                <Col md="1"><Button onClick={() => deletePeriod()}>Delete</Button></Col>
            </Row>
            <Row>
                <Col md="12" className="mt-3">
                    <Row>
                        <Col md="12" className="text-center">
                            <FullCalendar
                                plugins = {[ dayGridPlugin ]}
                                initialView = "dayGridMonth"
                                events = {period}
                                
                                datesSet = {(arg) => {
                                    changeCalenderBeginDate(arg.start);
                                    changeCalenderEndDate(arg.end);
                                }}
                                eventClick = {(arg) => {
                                    handleClick(arg);
                                }
                                }

                            >
                            </FullCalendar>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div >
    );
};

export default EditPeriod;