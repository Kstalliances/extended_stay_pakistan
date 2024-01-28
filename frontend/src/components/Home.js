import React, {useEffect, useReducer, useState} from "react";
import Base from "./Base";
import 'react-toastify/dist/ReactToastify.css';
import {deleteUserRoom, getRoomById, getRooms} from "../service/roomsservice";
import {
    Card,
    CardBody,
    CardImg,
    CardText,
    CardTitle,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import {Chip, CircularProgress} from "@mui/material";
import {getUserDetail, isLoggedIn} from "../service/userservice";
import {useNavigate} from "react-router-dom";

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MUModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import Popover from '@mui/material/Popover';
import '../style/EditButton.css';
import {ToastConfig} from "../config/toastConfig";
import {toast} from "react-toastify";
import PaginatedList from "../testing/PaginatedList";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: "1rem",
    transform: 'translate(-50%, -50%)',
    padding: '10px 0 10px 0'
};

const ChipStyle = {
    marginRight: '2px',
    fontSize: '11px',
    color: 'white',
    backgroundColor: '#008374'
}

const ChipLabelStyle = {
    color: 'black',
    fontWeight: 'bold',
    marginRight: '3px',
    textAlign: 'center'
}

const AvatarStyle = {
    backgroundColor: 'white'
}

const DeleteButton = {
    backgroundColor: '#d70000'
}
const Home = () => {

    const ACTION = {
        RESET_ROOMS: 'reset_rooms',
        ROOMS: 'rooms',
        ROOM_DETAIL: 'room_detail',
        USER_ID: 'user_id',
        IS_ROOM_DELETE: 'is_room_deleted',
        IS_ADMIN: 'is_admin',
        OPEN: 'open',
        ROOM_ID: 'room_ID',
        IMAGE_ID: 'image_id',
        LOADING: 'loading',
        ANCHOR_EL: 'anchor_el'

    };
    const initialState = {
        reset_rooms: [],
        rooms: [],
        room_detail: undefined,
        user_id: '',
        is_room_deleted: false,
        is_admin: false,
        open: false,
        room_ID: '',
        image_id: '',
        loading: true,
        anchor_el: null
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    function reducer(state, action) {
        switch (action.type) {
            case ACTION.RESET_ROOMS:
                return {...state, rooms: action.payload.rooms};
            case ACTION.ROOMS:
                return {...state, rooms: action.payload.rooms};
            case ACTION.ROOM_DETAIL:
                return {...state, room_detail: action.payload.room_detail};
            case ACTION.IS_ADMIN:
                return {...state, is_admin: action.payload.is_admin}
            case ACTION.USER_ID:
                return {...state, user_id: action.payload.user_id}
            case ACTION.ROOM_ID:
                return {...state, room_ID: action.room_ID}
            case ACTION.IMAGE_ID:
                return {...state, image_id: action.image_id}
            case ACTION.IS_ROOM_DELETE:
                return {...state, is_room_deleted: action.payload}
            case ACTION.LOADING:
                return {...state, loading: action.payload.loading}
            case ACTION.ANCHOR_EL:
                return {...state, anchor_el: action.anchor_el}
            default:
                return state;
        }
    }

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState({
        errorHeading: '',
        errorMessage: ''
    });

    // ----------------- For Showing Error -----------------
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event, ID, RoomImageId) => {
        // setForUpdateId(ID);
        // console.log(ID);
        // console.log(RoomImageId);

        dispatch({type: ACTION.ROOM_ID, room_ID: ID});
        dispatch({type: ACTION.IMAGE_ID, image_id: RoomImageId});
        dispatch({type: ACTION.ANCHOR_EL, anchor_el: event.currentTarget});
        setAnchorEl(event.currentTarget);

    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const openPopover = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    function openModal(roomId) {
        handleOpen();
        getRoomById(roomId)
            .then(response => {
                // console.log(response);
                dispatch({type: ACTION.ROOM_DETAIL, payload: {room_detail: response}})
            }).catch(error => {
            // console.log("Error: ", error)
        });
    }

    const goToBookingPage = (id) => {
        // console.log(id);
        if (isLoggedIn()) {
            navigate("/booking/" + id);
        } else {
            setModal(!modal);
            setError({errorHeading: 'Error', errorMessage: 'First login and then book a room!'});
        }
    }

    const goToRoomUpdatePage = (roomId) => {
        // console.log(roomId);
        if (isLoggedIn()) {
            navigate("/user/update-room/" + roomId);
        }
    }

    function deleteRoom(roomId, imageId) {
        // console.log(roomId);
        // console.log(imageId);
        dispatch({type: ACTION.IS_ROOM_DELETE, payload: true});
        setAnchorEl(null);
        setModal(!modal);
        setError({errorHeading: 'Warning', errorMessage: 'Do you want to delete this room'});
        // setDeleteRecordCreds({roomId: roomId, publicId: publicId});
    }

    function confirmDeleteRoom() {
        setModal(!modal);
        deleteUserRoom(state?.room_ID, state?.image_id, state.user_id)
            .then((response) => {
                toast.success('Room deleted successfully!', ToastConfig)
                // console.log(response);
                getRooms()
                    .then(response => {
                        // console.log(response);
                        dispatch({type: ACTION.RESET_ROOMS, payload: {rooms: response}});
                    })
                    .catch(error => {
                        console.log('Error: ', error)
                    });
            }).catch((error) => {
            console.log(error);
        });
        // window.location.reload(true);
    }

    function moreDetail(roomId) {
        navigate('/room-detail/' + roomId);
    }

    function handleAdmin(user) {
        if (user?.data?.userRole == 'ADMIN') {
            // setIsAdmin(true);
            dispatch({type: ACTION.IS_ADMIN, payload: {is_admin: true}});
        }

    }

    useEffect(() => {
        handleAdmin(getUserDetail());
        // ------------- Get User Detail From Local (Browser) -------------
        // setUserId(getUserDetail()?.data?.userId);
        dispatch({type: ACTION.USER_ID, payload: {user_id: getUserDetail()?.data?.userId}})
        getRooms()
            .then(response => {
                dispatch({type: ACTION.LOADING, payload: {loading: false}})
                // console.log(response);
                // setRooms(response);
                dispatch({type: ACTION.ROOMS, payload: {rooms: response}});
            }).catch(error => {
            // console.log('Error: ', error)
        })
    }, []);


    return (
        <Base>
            <div style={{margin: '40px'}}>
                {/* Loading... */}
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={state?.loading}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
                <Row className="d-flex">
                    {/* List of rooms */}
                    {state.rooms &&
                        state.rooms.map(room => (
                            <Col xl={4} lg={4} md={4} sm={6} key={room?._id}>
                                <Card
                                    className="d-flex justify-content-around align-content-center"
                                    color="light"
                                    style={{
                                        // width: 'rem',
                                        textAlign: 'left',
                                        borderRadius: '20px',
                                        marginBottom: '2rem'
                                    }}
                                >
                                    {/* Action Button (Update/Delete) */}
                                    {state.is_admin &&
                                        <>
                                            <EditIcon className="edit_button"
                                                      onClick={(e) =>
                                                          handleClick(e, room?._id, room?.room_img_public_id)}/>
                                            <Popover
                                                // id={room._id}
                                                open={openPopover}
                                                anchorEl={state?.anchor_el}
                                                onClose={handlePopoverClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'left',
                                                }}
                                            >
                                                <div style={{padding: '5px'}}>
                                                    <Button size="small" variant="contained" className="mb-2"
                                                            onClick={() => goToRoomUpdatePage(state?.room_ID)}>
                                                        Update
                                                    </Button>
                                                    <br/>
                                                    <Button style={DeleteButton} size="small" variant="contained"
                                                            onClick={() =>
                                                                deleteRoom(state?.room_ID, state?.image_id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </Popover>
                                        </>
                                    }
                                    <CardImg
                                        alt="Card image cap"
                                        src={room.room_img_url}
                                        onClick={() => openModal(room?._id)}
                                        style={{
                                            borderTopRightRadius: '20px', borderTopLeftRadius: '20px'
                                        }}
                                        width="100%"
                                    />
                                    <CardBody>
                                        <CardTitle tag="h5">{room.room_type}</CardTitle>
                                        <CardText>{room?.description.substring(0, 100)}...
                                            <span style={{color: "cadetblue", cursor: 'pointer'}}
                                                  onClick={() => moreDetail(room?._id)}> <u>Read more</u></span>
                                        </CardText>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                            <b>Dimensions:</b> {room.dimensions}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                            <b>Location:</b> {room.location}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                            <b>Google map link:</b> <a href={room.google_map}>{room.google_map}</a></p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                            Name:</b> {room.contact_name}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                            No:</b> {room.contact_no}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Total
                                            Rooms:</b> {room.total_rooms}</p>
                                        <hr/>
                                        <Row className="d-flex justify-content-around align-content-center"
                                             style={{marginBottom: '15px'}}>
                                            <h6>Facilities</h6>
                                            <Col>
                                                {room?.wifi === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Wifi"/>
                                                }
                                                {room?.car_parking === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Car Parking"/>
                                                }
                                                {room?.meals === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Meals"/>
                                                }
                                                {room?.washing === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Washing"/>
                                                }
                                                {room?.attached_bath === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Attached Bath"/>
                                                }
                                                {room?.room_service === 'Y' &&
                                                    <Chip size="small" style={ChipStyle} label="Room Service"/>
                                                }
                                            </Col>
                                        </Row>
                                        <Button variant="outlined"
                                                onClick={() => goToBookingPage(room._id)}
                                                style={{borderRadius: '5rem'}}>
                                            Booking
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                </Row>
                <Row>
                    <MUModal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{backdrop: Backdrop}}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <Container>
                                    <CardImg src={state.room_detail?.room_img_url} alt="Image here"/>
                                </Container>
                                {/*<Col xl={4} lg={4} md={12}>*/}
                                {/*</Col>*/}
                            </Box>

                        </Fade>
                    </MUModal>
                </Row>
                {
                    !state.rooms &&
                    <Container style={{marginTop: '100px'}}>
                        <h3>No Content here</h3>
                    </Container>
                }

                {/*<ResponsiveAppBar/>*/
                }
            </div>
            {/*<PriceAndRules/>*/}
            <div>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} style={{color: 'red'}}>{error?.errorHeading}</ModalHeader>
                    <ModalBody>
                        {error?.errorMessage}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="contained" onClick={toggle}>
                            Cancel
                        </Button>
                        {state.is_room_deleted &&
                            <Button className="mx-2" style={{backgroundColor: "#ce181e",}}
                                    variant="contained" onClick={confirmDeleteRoom}>
                                Yes
                            </Button>}
                    </ModalFooter>
                </Modal>
            </div>
        </Base>
    );
};

export default Home;
