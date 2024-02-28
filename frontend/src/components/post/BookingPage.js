import Base from "../Base";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {BookRoom, CalculateTotalAmount, getAccDetail} from "../../service/BookingService";
import {
    Card,
    Col,
    Container,
    Form,
    FormGroup,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import Button from "@mui/material/Button";
import jasscash from "../../img/Jazz-cash.jpg";
import standard from '../../img/standard.png';
import styled from "styled-components";
import {getUserDetail} from "../../service/userservice";
import "../../style/DatePicker.css";
import "../../style/general.css";
import {getRoomDates, getRoomReservedDates} from "../../service/roomsservice";
import Calendar from "react-calendar";
import {Alert} from "@mui/material";

const RoomCreds = styled.p`
    padding: 12px;
    color: #666;
    border-radius: 1rem;
    transition: 0.5s ease;
`;

const CardStyle = {
    backgroundColor: '#f3f4f7',
    border: 'none',
    marginTop: '20px',
    borderRadius: '20px'
}

const AccCardStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    border: 'none',
    padding: '8px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center', /* Horizontally center align */
    alignItems: 'center',
    marginBottom: '15px'
}

const AccStyle = {
    color: '#0C356A',
    fontSize: '12px'
}

const HeadingStyle = {
    color: '#0C356A',
    marginBottom: '20px'
}

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
    const [showModal, setShowModel] = useState(false);
    const [accOne, setAccOne] = useState();
    const [accTwo, setAccTwo] = useState();
    const [success, setSuccess] = useState(false);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const [selectedRanges, setSelectedRanges] = useState([]);


    // ----------------- For Showing Error -----------------
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // ----------------- Handle Rent -----------------
    const handleRate = () => {
        if (!fromDate && !toDate) {
            setModal(!modal);
            setErrorMessage('Select the dates to calculate (Rent)')
        } else {
            if (fromDate > toDate) {
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

    const handleFromDate = (d) => {
        const date = new Date(d);

        // Get the parts of the date (year, month, day)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        // Format the date as 'YYYY-MM-DD'
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        setFromDate(formattedDate);
    }

    const handleToDate = (d) => {
        const date = new Date(d);

        // Get the parts of the date (year, month, day)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        // Format the date as 'YYYY-MM-DD'
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        setToDate(formattedDate);
    }

    useEffect(() => {
        // ------------- Get List of Room Dates -------------
        getRoomDates(roomId)
            .then((response) => {
                const ranges = response.map(date => ({
                    startDate: new Date(date.start_date),
                    endDate: new Date(date.end_date), // Assuming each date is both start and end date
                }));
                setSelectedRanges(ranges);

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

    function getDatesInRange(start, end) {
        const dates = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    const allHighlightedDates = selectedRanges.flatMap(range =>
        getDatesInRange(range.startDate, range.endDate)
    );

    const tileContent = ({date, view}) => {
        const isHighlighted = allHighlightedDates.some(d => d.toDateString() === date.toDateString());

        const tileStyle = {
            backgroundColor: isHighlighted ? '#ffcccb' : 'rgba(0, 0, 0, 0.1)', // Set dim color for non-highlighted dates
            borderRadius: '8px',
            width: '80%',
            height: '80%',
            margin: '10%',
        };

        return (
            <div className="date-tile" style={tileStyle}>
                {isHighlighted && <div className="highlighted-date"></div>}
            </div>
        );
    };

    return (
        <Base>
            <Row className="d-flex justify-content-around">
                <Col lg={8}>
                    <Container className="text-start p-4" style={CardStyle}>
                        <h3 style={HeadingStyle}>Payment</h3>
                        <Row>
                            <Col lg={4} md={5} sm={5} xs={12}>
                                <Card style={AccCardStyle}>
                                    <img src={standard} width={100} alt="image here"/>
                                    <h6 style={AccStyle}>Acc Name: <span className="mx-1">{accOne?.acc_name}</span></h6>
                                    <h6 style={AccStyle}>Acc No: <span className="mx-1">{accOne?.acc_number}</span></h6>
                                </Card>
                            </Col>
                            <Col lg={4} md={5} sm={5} xs={12}>
                                <Card style={AccCardStyle}>
                                    <img src={jasscash} width={100} alt="image here"/>
                                    <h6 style={AccStyle}>Acc Name: <span className="mx-1">{accTwo?.acc_name}</span></h6>
                                    <h6 style={AccStyle}>Acc No: <span className="mx-1">{accTwo?.acc_number}</span></h6>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col lg={8}>
                    <Container className="text-start p-4" style={CardStyle}>
                        {success &&
                            <Alert style={{
                                marginBottom: '20px',
                                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
                                borderRadius: '10px'
                            }}
                                   severity="success"
                                   sx={{transition: 'opacity 0.5s', opacity: 1}}
                            >
                                Room booked successfully!
                            </Alert>
                        }
                        {/*  Card heading  */}
                        <h3 style={HeadingStyle}>Check In/Check Out</h3>

                        {/*  Room Availability  */}
                        <Card style={{backgroundColor: 'transparent', border: 'none', marginBottom: '8px'}}>
                            <h6 style={{fontSize: '12px'}}>Available Rooms</h6>
                            <div style={{width: '40px', height: '20px', backgroundColor: 'rgba(0, 0, 0, 0.1'}}/>
                        </Card>
                        <Card style={{backgroundColor: 'transparent', border: 'none'}}>
                            <h6 style={{fontSize: '12px'}}>Booked Rooms</h6>
                            <div style={{width: '40px', height: '20px', backgroundColor: '#ffcccb'}}/>
                        </Card>

                        {/*  Calculate rate  */}
                        <Form style={{textAlign: "left"}}>
                            <Row>
                                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                                    <FormGroup>
                                        <Label>Check In</Label>
                                        <Calendar
                                            // value={fromDate}
                                            onChange={handleFromDate}
                                            tileContent={tileContent}
                                            tileDisabled={({date}) => date < new Date().setHours(0, 0, 0, 0)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                                    <FormGroup>
                                        <Label>Check Out</Label>
                                        <Calendar
                                            value={toDate}
                                            onChange={handleToDate}
                                            tileContent={tileContent}
                                            tileDisabled={({date}) => date < new Date().setHours(0, 0, 0, 0)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col className="mt-1">
                                    <Button variant="outlined"
                                            onClick={handleRate}>Calculate</Button>
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
                                    <Button variant={fromDate === '' || toDate === '' ? 'outlined' : 'contained'}
                                        // disabled={fromDate === '' || toDate === ''}
                                            onClick={handleBooking}>Book now</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </Col>
            </Row>


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