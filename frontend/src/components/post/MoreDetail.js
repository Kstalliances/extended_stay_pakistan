import styled from "styled-components";
import {Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import {getRoomBookingStatus, getRoomById} from "../../service/roomsservice";
import {useNavigate, useParams} from "react-router-dom";
import Base from "../Base";
import Button from "@mui/material/Button";
import {isLoggedIn} from "../../service/userservice";
import {Alert, Avatar, Chip} from "@mui/material";
import {PriceBollets} from "../priceBollets";
import {StandardRoom} from "../PriceAndRuleData";

const DetailComponent = styled.div`
  //max-width: 400px;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 20px;
  //border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RoomImage = styled.img`
  //display: flex;
  width: 100%;
  margin: 6px;
  height: 200px;
  border-radius: 18px;
  object-fit: cover;
`;

const RoomDetails = styled.div`
  padding: 16px;
  text-align: left;
`;

const TYPE = styled.h2`
  margin-bottom: 8px;
  color: #262626;
  font-size: 18px;
`;

const Description = styled.p`
  color: #666;
`;

const Price = styled.div`
  margin-top: 16px;
  font-size: 1.2em;
  color: #3498db;
`;

const ChipStyle = {
    backgroundColor: 'grey',
    color: 'white',
    marginRight: '3px'
}

const BookingStatus = styled.div`
  color: wheat;
  font-family: Calibri;
  font-weight: bold;
  background-color: #0077c8;
  padding: 2px 8px;
  border-radius: 8px;
  width: 80px;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const MoreDetailComponent = () => {

    const {roomId} = useParams();
    const [roomDetail, setRoomDetail] = useState();
    const [user, setUser] = useState();
    const [roomStatus, setRoomStatus] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // get single room detail from backend
        // console.log(roomId);
        getRoomById(roomId)
            .then(response => {
                // console.log(response);
                setRoomDetail(response);
            }).catch(error => {
            // console.log("Error: ", error)
        });

        // is room already booked / available for booking
        getRoomBookingStatus(roomId)
            .then(response => {
                setRoomStatus(response);
                // console.log(response);
            }).catch(error => {
            console.log(error);
        });


    }, [roomId]);

    const navigate = useNavigate();

    const goToBookingPage = () => {
        if (isLoggedIn()) {
            navigate("/booking/" + roomId);
        } else {
            setModal(!modal);
            setErrorMessage('First login and then book a room!');
            setIsLogin(true);
            setTimeout(() => {
                setIsLogin(false);
            }, 4000);
            navigate('/room-detail/' + roomId);
        }
    }

    // ----------------- For Showing Error -----------------
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    return (
        <Base>
            <DetailComponent>
                {/*{JSON.stringify(roomStatus)}*/}
                <Row className="d-flex m-3">
                    {roomDetail?.images.map((image) => (
                        <Col xl={3} lg={3} md={4} sm={5} xs={12}>
                            {/*{JSON.stringify(roomDetail?.images)}*/}
                            <RoomImage src={image?.room_img_url} alt="Image here"/>
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <RoomDetails>
                            {/*<BookingStatus>{roomStatus.Status}</BookingStatus>*/}
                            <TYPE>{roomDetail?.room_type}</TYPE>
                            <Description>{roomDetail?.description}</Description>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                <b>Dimensions:</b> {roomDetail?.dimensions}</p>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                <b>Location:</b> {roomDetail?.location}
                            </p>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                <b>Google map link:</b> <a href={roomDetail?.google_map}>{roomDetail?.google_map}</a>
                            </p>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                Name:</b> {roomDetail?.contact_name}</p>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                No:</b> {roomDetail?.contact_no}</p>
                            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Total
                                Rooms:</b> {roomDetail?.total_rooms}</p>
                            <Row className="d-flex justify-content-around align-content-center"
                                 style={{marginBottom: '15px'}}>
                                <Col>
                                    {roomDetail?.wifi === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Wifi"/>
                                    }
                                    {roomDetail?.car_parking === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Car Parking"/>
                                    }
                                    {roomDetail?.meals === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Meals"/>
                                    }
                                    {roomDetail?.washing === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Washing"/>
                                    }
                                    {roomDetail?.attached_bath === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Attached Bath"/>
                                    }
                                    {roomDetail?.room_service === 'Y' &&
                                        <Chip size="small" style={ChipStyle} label="Room Service"/>
                                    }
                                    {/* Price */}
                                    <Row className="d-flex justify-content-center align-content-center">
                                        {StandardRoom.map(d => (
                                            <Col className='mt-2'
                                                 xl={3} lg={3} md={3} sm={4} xs={6}>

                                                <PriceBollets heading={d.cardHeading} sub_heading={d.cardDay}
                                                              amount={d.cardAmount}
                                                              discount={d.cardDiscount}/>
                                            </Col>
                                        ))
                                        }
                                    < /Row>
                                </Col>
                            </Row>

                            {/* Button */}
                            <Button variant="contained"
                                    onClick={goToBookingPage}
                                    style={{borderRadius: '5rem'}}
                                // disabled={roomStatus.Status === 'Booked'}
                            >Booking</Button>
                        </RoomDetails>
                    </Col>
                </Row>
            </DetailComponent>
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
};

export default MoreDetailComponent;