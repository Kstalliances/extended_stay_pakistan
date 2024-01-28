// RoomComponent.js
import React from 'react';
import styled from 'styled-components';
import {Card, CardBody, CardImg, CardImgOverlay, CardSubtitle, CardText, CardTitle, Col, Row} from "reactstrap";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import WifiIcon from "@mui/icons-material/Wifi";
import ShowerIcon from "@mui/icons-material/Shower";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import {Avatar, Chip} from "@mui/material";
import {isLoggedIn} from "../service/userservice";

const RoomWrapper = styled.div`
  //max-width: 400px;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 20px;
  //border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const RoomImage = styled.img`
  width: 100%;
  //height: 200px;
  border-radius: 18px;
  object-fit: cover;
`;

const RoomDetails = styled.div`
  padding: 16px;
  text-align: left;
`;

const TYPE = styled.h2`
  margin-bottom: 8px;
  color: #8b8b8b;
  font-size: 12px;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 6px;
`;

const Price = styled.div`
  margin-top: 16px;
  font-size: 1.2em;
  color: #3498db;
`;

const ButtonS = styled.div`
  background-color: #504099; /* Green */
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  //margin: 4px 2px;
  cursor: pointer;

  &:hover {
    background-color: #313866; /* Darker green on hover */
  }
`;

export const RoomComponent = ({id, imageSrc, description, roomType}) => {
    const navigate = useNavigate();

    const goToBookingPage = () => {
        if (isLoggedIn()) {
            navigate("/booking/" + id);
        } else {
            // setIsLogin(true);
            // setTimeout(() => {
            //     setIsLogin(false);
            // }, 4000);
            // navigate('/room-detail/' + roomId);
        }
    }
    return (
        <div>
            {/*<Row className="d-flex justify-content-around align-content-center">*/}
            {/*    <Col xl="8">*/}
            {/*        <Card*/}
            {/*            className="d-flex justify-content-around align-content-center"*/}
            {/*            color="light"*/}
            {/*            style={{*/}
            {/*                width: '25rem',*/}
            {/*                textAlign: 'left',*/}
            {/*                borderRadius: '20px'*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <CardImg*/}
            {/*                alt="Card image cap"*/}
            {/*                src="https://picsum.photos/900/270?grayscale"*/}
            {/*                style={{*/}
            {/*                    height: 270,*/}
            {/*                    borderTopRightRadius: '20px', borderTopLeftRadius: '20px'*/}
            {/*                }}*/}
            {/*                width="100%"*/}
            {/*            />*/}
            {/*            <CardImgOverlay>*/}
            {/*                <div style={{*/}
            {/*                    borderRadius: '8px',*/}
            {/*                    paddingLeft: '5px',*/}
            {/*                    color: 'white'*/}
            {/*                }}>*/}
            {/*                    <CardTitle tag="h5">{roomType}</CardTitle>*/}
            {/*                    <CardSubtitle*/}
            {/*                        className="mb-2"*/}
            {/*                        tag="h6"*/}
            {/*                        style={{color: 'white', opacity: '1'}}*/}
            {/*                    >*/}
            {/*                        Room Name*/}
            {/*                    </CardSubtitle>*/}
            {/*                </div>*/}
            {/*            </CardImgOverlay>*/}
            {/*            <CardBody>*/}
            {/*                <CardText>*/}
            {/*                    Some quick example text to build on the card title and make up the bulk of the*/}
            {/*                    card‘s*/}
            {/*                    content.*/}
            {/*                </CardText>*/}
            {/*                <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Dimensions:</b></p>*/}
            {/*                <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Location:</b></p>*/}
            {/*                <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact Name:</b></p>*/}
            {/*                <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact No:</b>:</p>*/}
            {/*                <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Total Rooms:</b>:</p>*/}
            {/*                <Row className="d-flex justify-content-around align-content-center"*/}
            {/*                     style={{marginBottom: '15px'}}>*/}
            {/*                    <Col>*/}
            {/*                        <Chip size="small"*/}
            {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
            {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
            {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
            {/*                              label="Wifi"/>*/}
            {/*                        <Chip size="small"*/}
            {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
            {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
            {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
            {/*                              label="Car Parking"/>*/}
            {/*                        <Chip size="small"*/}
            {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
            {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
            {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
            {/*                              label="Meals Facility"/>*/}
            {/*                        <Chip size="small"*/}
            {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
            {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
            {/*                                  style={{fontSize: '11px', color: 'black'}}>N</span></Avatar>}*/}
            {/*                              label="Attached Bath"/>*/}
            {/*                        <Chip size="small"*/}
            {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
            {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
            {/*                                  style={{fontSize: '11px', color: 'black'}}>N</span></Avatar>}*/}
            {/*                              label="Room Service"/>*/}
            {/*                    </Col>*/}
            {/*                </Row>*/}
            {/*                <Button variant="outlined"*/}
            {/*                        onClick={goToBookingPage}*/}
            {/*                        style={{borderRadius: '5rem'}}*/}
            {/*                    // disabled={roomStatus.Status === 'Booked'}*/}
            {/*                >Booking*/}
            {/*                </Button>*/}
            {/*            </CardBody>*/}
            {/*        </Card>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/*<RoomWrapper>*/}


                {/*<Row>*/}
                {/*    <Col xl={4} lg={4} md={6} sm={12} xs={12}>*/}
                {/*        <RoomImage src={imageSrc} alt="Image here"/>*/}
                {/*    </Col>*/}
                {/*    <Col xl={8} lg={8} md={6} sm={12} xs={12}>*/}
                {/*        <RoomDetails>*/}
                {/*            <TYPE> Room</TYPE>*/}
                {/*            <Description>{description}</Description>*/}
                {/*            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Dimensions:</b></p>*/}
                {/*            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Location:</b></p>*/}
                {/*            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact Name:</b></p>*/}
                {/*            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact No:</b>:</p>*/}
                {/*            <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Total Rooms:</b>:</p>*/}

                {/*            /!* Facilities *!/*/}
                {/*            <div>*/}
                {/*                <Row className="d-flex justify-content-around align-content-center"*/}
                {/*                     style={{marginBottom: '15px'}}>*/}
                {/*                    <Col>*/}
                {/*                        <Chip size="small"*/}
                {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
                {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
                {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
                {/*                              label="Wifi"/>*/}
                {/*                        <Chip size="small"*/}
                {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
                {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
                {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
                {/*                              label="Car Parking"/>*/}
                {/*                        <Chip size="small"*/}
                {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
                {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
                {/*                                  style={{fontSize: '11px', color: 'black'}}>Y</span></Avatar>}*/}
                {/*                              label="Meals Facility"/>*/}
                {/*                        <Chip size="small"*/}
                {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
                {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
                {/*                                  style={{fontSize: '11px', color: 'black'}}>N</span></Avatar>}*/}
                {/*                              label="Attached Bath"/>*/}
                {/*                        <Chip size="small"*/}
                {/*                              style={{backgroundColor: 'grey', color: 'white', marginRight: '3px'}}*/}
                {/*                              avatar={<Avatar style={{backgroundColor: 'floralwhite'}}><span*/}
                {/*                                  style={{fontSize: '11px', color: 'black'}}>N</span></Avatar>}*/}
                {/*                              label="Room Service"/>*/}
                {/*                    </Col>*/}
                {/*                </Row>*/}
                {/*            </div>*/}
                {/*            /!*<Button variant="outlined" onClick={() => {*!/*/}
                {/*            /!*    navigate("/room-detail/" + id);*!/*/}
                {/*            /!*}}>More detail</Button>*!/*/}
                {/*            /!*<Link to={'/' + id} className="btn btn-dark"></Link>*!/*/}
                {/*        </RoomDetails>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            {/*</RoomWrapper>*/}
        </div>
    )
}
