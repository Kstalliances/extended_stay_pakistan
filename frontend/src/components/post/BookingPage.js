import Base from "../Base";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {BookRoom, CalculateTotalAmount, getAccDetail} from "../../service/BookingService";
import {Alert, Tooltip} from "@mui/material";
import Container from "@mui/material/Container";
import {Card, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import Button from "@mui/material/Button";
import jasscash from "../../img/Jazz-cash.jpg";
import standard from '../../img/standard.png';
import styled from "styled-components";
import {getUserDetail} from "../../service/userservice";
import "../../style/DatePicker.css";
import "../../style/general.css";
import {getRoomDates, getRoomReservedDates} from "../../service/roomsservice";

const RoomCreds = styled.p`
  padding: 12px;
  color: #666;
  border-radius: 1rem;
  transition: 0.5s ease;

  &:hover {
    background: #f3f4f7;
    cursor: pointer;
  }
`;

export const BookingPage = () => {
    // ----------------- Hooks -----------------
    const {roomId} = useParams();
    const [userId, setUserId] = useState();
    const [paymentDetail, setPaymentDetail] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dateRangeError, setDateRangeError] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [listOfDates, setListOfDates] = useState([]);
    const [showModal, setShowModel] = useState(false);
    const [accOne, setAccOne] = useState();
    const [accTwo, setAccTwo] = useState();
    const [success, setSuccess] = useState(false);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');


    // ----------------- For Showing Error -----------------
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // ----------------- Handle Rent -----------------
    const handleRate = () => {
        if (!fromDate && !toDate) {
            setModal(!modal);
            setErrorMessage('Select the dates to calculate (Rent)')
        } else {
            if (fromDate < today || toDate < today) {
                // console.log('Condition true');
                setModal(!modal);
                setErrorMessage('Please select a future date for check-in');
            } else if (fromDate > toDate) {
                setModal(!modal);
                setErrorMessage('Oh no! Start Date cannot be greater than End Date. Please select valid dates.');
            } else {
                CalculateTotalAmount(roomId, userId, fromDate, toDate)
                    .then(response => {
                        if (response.status === true) {
                            setPaymentDetail(response.data);
                        } else {
                            setModal(!modal);
                            setErrorMessage('Start date is greater from end date!');
                            setTimeout(() => {
                                setDateRangeError(false);
                            }, 4000);
                        }
                    }).catch((error) => {
                    console.log(error);
                })
            }
        }
    }

    // ----------------- Scroll Up Window -----------------
    function scrollUpWindow() {
        window.scroll(0, 0);
    }

    const handleBooking = () => {
        // validateDates();
        if (paymentDetail === null || paymentDetail === '' || paymentDetail.rent === null) {
            // ----------------- Call error method -----------------
            setModal(!modal);
            setShowModel(true);
            setErrorMessage('First calculate the rent');
            scrollUpWindow();
            return;
        }
        if (fromDate === '' || toDate === '') {
            // ----------------- Call error method -----------------
            setModal(!modal);
            setErrorMessage('Please select the date and calculate the rate!')
            // showErrorOnBooking(true, '', 6000);
            scrollUpWindow();
            return;
        }
        BookRoom(userId, roomId, paymentDetail.amount_after_discount, paymentDetail.number_of_days, paymentDetail.discount, fromDate, toDate)
            .then(response => {
                setSuccess(true);
                scrollUpWindow();
                setTimeout(() => {
                    setSuccess(false);
                }, 6000);
            }).catch((error) => {
            setModal(!modal);
            setErrorMessage('Room already booked for the selected dates! Please check list of booked room dates');
            console.log(error);
        })

    }

    const handleFromDate = (e) => {
        const selectedDate = e.target.value;
        if (selectedDate < today) {
            setError('Please select a future date for check-in');
        } else {
            setFromDate(selectedDate.toString());
        }
    }

    const handleToDate = (e) => {

        const selectedDate = e.target.value;
        if (selectedDate < today) {
            setError('Please select a future date for check-out');
        } else {
            setToDate(selectedDate.toString());
        }
    }

    useEffect(() => {

        // ------------- Get List of Room Dates -------------
        getRoomDates(roomId)
            .then((response) => {
                setListOfDates(response);
            }).catch((error) => {
            // console.log(error);
        });

        // ------------- Get User Detail From Local (Browser) -------------
        setUserId(getUserDetail().data.userId);

        // ------------- Get Room Reserved Dates -------------
        getRoomReservedDates(roomId)
            .then((response) => {
            }).catch((error) => {
            console.log(error);
        });

        // ------------- Get Acc Details -------------
        getAccDetail()
            .then((response) => {
                setAccOne(response?.data[0]);
                setAccTwo(response?.data[1]);
            }).catch((error) => {
            console.log(error);
        });

    }, []);

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Base>
            <Container style={{marginBottom: '80px'}}>
                <Row className="d-flex justify-content-center align-content-center">
                    <Col xl={4} lg={8} xs={12}>
                        <Card className="mt-5 p-2" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}}>
                            <h6>This room is not available in these dates</h6>
                            {/*{JSON.stringify(listOfDates)}*/}
                            {listOfDates &&
                                listOfDates?.map(date => (
                                    <span key={date.start_date}>[ {date.start_date} - {date.end_date} ]</span>
                                ))
                            }
                        </Card>
                    </Col>
                    <Col xl={8} lg={8}>
                        <Card className="mt-5 p-3" style={{boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}}>
                            {success &&
                                <Alert style={{marginBottom: '20px'}}
                                       severity="success"
                                       sx={{transition: 'opacity 0.5s', opacity: 1}}
                                >
                                    Room booked successfully!
                                </Alert>
                            }
                            <Form style={{textAlign: "left"}}>
                                <Row className="d-flex justify-content-center"
                                     xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <h3>Payment</h3>
                                </Row>
                                <Row className="mt-3">
                                    <Col xl={3} lg={6} md={3} sm={4} xs={12}
                                         className="mb-4">
                                        <img src={standard} width={125} alt="image here"/>
                                    </Col>
                                    <Col xl={3} lg={6} md={3} sm={4} xs={12}>
                                        <h6 style={{color: '#6a737b'}}>Acc Name: <span
                                            className="mx-1">{accOne?.acc_name}</span>
                                        </h6>
                                        <h6 style={{color: '#6a737b'}}>Acc No:
                                            <span className="mx-1">{accOne?.acc_number}</span>
                                        </h6>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={3} lg={6} md={3} sm={4} xs={12}>
                                        <img src={jasscash} width={100} height={60}
                                             alt="image here"/>
                                    </Col>
                                    <Col xl={3} lg={6} md={3} sm={4} xs={12}>
                                        <h6 style={{color: '#6a737b'}}>Acc Name: <span
                                            className="mx-1">{accTwo?.acc_name}</span>
                                        </h6>
                                        <h6 style={{color: '#6a737b'}}>Acc No:
                                            <span className="mx-1">{accTwo?.acc_number}</span>
                                        </h6>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className="d-flex justify-content-center"
                                     xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <h3>Check In/Check Out</h3>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <FormGroup>
                                            <Label>Check In</Label>
                                            <Input type="date"
                                                   className="custom-date-input"
                                                   value={fromDate}
                                                   min={today}
                                                   onChange={handleFromDate}
                                                   required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                                        <FormGroup>
                                            <Label>Check Out</Label>
                                            <Input type="date"
                                                   className="custom-date-input"
                                                   value={toDate}
                                                   min={checkInDate || today}
                                                   onChange={handleToDate}
                                                   required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className="mt-1">
                                        <Button variant="outlined"
                                                onClick={handleRate}>Calculate</Button>
                                    </Col>
                                </Row>
                                <Row className="mt-3 mb-3">
                                    <Col xl={5} lg={5} md={5} sm={12} xs={12}>
                                        <RoomCreds>
                                            <h6>Rent (Per Day): {paymentDetail?.rent_per_day}
                                                {paymentDetail &&
                                                    <s style={{color: 'lightgray'}}> 3000</s>}
                                            </h6>
                                            <h6>Days: {paymentDetail?.number_of_days}</h6>
                                            <h6>Rent: {paymentDetail?.rent}</h6>
                                            <h6>Discount: {paymentDetail?.discount}%</h6>
                                            <hr/>
                                            <h6>Total Amount: <b>{paymentDetail?.amount_after_discount}</b></h6>
                                        </RoomCreds>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Button variant={fromDate === '' || toDate === '' ? 'outlined' : 'contained'}
                                            // disabled={fromDate === '' || toDate === ''}
                                                onClick={handleBooking}>Book now</Button>
                                    </Col>
                                </Row>
                                <Row>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <div>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} style={{color: 'red'}}>Error</ModalHeader>
                    <ModalBody>
                        {errorMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{backgroundColor: "#ce181e"}}
                                variant="contained" onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </Base>
    )
}