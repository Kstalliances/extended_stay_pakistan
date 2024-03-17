import React, {useEffect, useReducer, useState} from "react";
import Base from "../Base";
import 'react-toastify/dist/ReactToastify.css';
import {deleteUserRoom, getRoomById, getRooms} from "../../service/roomsservice";
import {Card, CardBody, Col, Row,} from "reactstrap";
import {getUserDetail, isLoggedIn} from "../../service/userservice";
import {useNavigate} from "react-router-dom";
import '../../style/EditButton.css';
import {ToastConfig} from "../../config/toastConfig";
import {toast} from "react-toastify";
import Button from "@mui/material/Button";
import {CircularProgress, Popover} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import EditIcon from "@mui/icons-material/Edit";
import ImageList from "../../testing/ImageList";
import {Modal} from "react-bootstrap";

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

const RoomCardStyle = {
    border: 'none',
    backgroundColor: '#f3f4f7',
    // padding: '8px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center', /* Horizontally center align */
    // alignItems: 'center',
    marginBottom: '15px',
}

const CardInnerStyle = {
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '10px'
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
        ANCHOR_EL: 'anchor_el',
        ERROR_IMAGE: 'error_image'

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
        anchor_el: null,
        error_image: false
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
            case ACTION.ERROR_IMAGE:
                return {...state, error_image: action.payload.error_image}
            default:
                return state;
        }
    }

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [emptyMessage, setEmptyMessage] = useState(true);
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
                // console.log(response);
                getRooms()
                    .then(response => {
                        // console.log(response);
                        dispatch({type: ACTION.RESET_ROOMS, payload: {rooms: response}});
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 500);
                    })
                    .catch(error => {
                        console.log('Error: ', error)
                    });
                toast.success('Room deleted successfully!', ToastConfig)
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
        let retryCount = 0;

        // ------------- Get User Detail From Local (Browser) -------------
        handleAdmin(getUserDetail());
        dispatch({type: ACTION.USER_ID, payload: {user_id: getUserDetail()?.data?.userId}})
        const fetchData = async () => {
            try {
                const response = await getRooms();
                dispatch({type: ACTION.LOADING, payload: {loading: false}});
                dispatch({type: ACTION.ERROR_IMAGE, payload: {error_image: false}});
                dispatch({type: ACTION.ROOMS, payload: {rooms: response}});
                setEmptyMessage(false);
                if (!response) {
                    setTimeout(() => {
                        fetchData();
                    }, 4000);
                }
            } catch (error) {
                console.error('Error:', error);
                setTimeout(() => {
                    fetchData();
                }, 4000);
            }
        };

        fetchData();
    }, []);


    return (
        <Base>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={state?.loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Row className="d-flex m-2 mt-5">
                {state.rooms &&
                    state.rooms.map(room => (
                        <Col xl={3} lg={3} md={3} sm={6} xs={6} key={room?._id}>
                            <Card className="text-start" style={RoomCardStyle}>
                                {/*<img*/}
                                {/*    onClick={() => moreDetail(room?._id)}*/}
                                {/*    src={room.images[0]?.room_img_url}*/}
                                {/*    alt="Image here"*/}
                                {/*    width="100%"*/}
                                {/*    // height="150"*/}
                                {/*    style={{borderTopLeftRadius: '20px', borderTopRightRadius: '20px'}}*/}
                                {/*/>*/}
                                <ImageList images={room?.images}/>
                                <CardBody>
                                    <div>
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
                                                        <Button size="small" variant="contained"
                                                                className="mb-2"
                                                                onClick={() => goToRoomUpdatePage(state?.room_ID)}>
                                                            Update
                                                        </Button>
                                                        <br/>
                                                        <Button style={DeleteButton} size="small"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    deleteRoom(state?.room_ID, state?.image_id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Popover>
                                            </>
                                        }
                                        <h6 className="mt-2"
                                            onClick={() => moreDetail(room?._id)}>{room?.room_type}</h6>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}>
                                            <b>Location:</b> {room.location}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                            Name:</b> {room.contact_name}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Contact
                                            No:</b> {room.contact_no}</p>
                                        <p style={{fontSize: '12px', marginBottom: '4px'}}><b>Total
                                            Rooms:</b> {room.total_rooms}</p>
                                        <Button variant="outlined"
                                                onClick={() => goToBookingPage(room._id)}
                                                style={{borderRadius: '10px', marginTop: "8px"}}>
                                            Booking
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
            </Row>
            {/* This is for confirmation model  */
            }
            <div>
                {/* New Modal */}
                <Modal show={modal} onHide={toggle}>
                    <Modal.Header closeButton>
                        <Modal.Title>{error?.errorHeading}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="alert alert-danger">{error?.errorMessage}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="contained" onClick={toggle} style={{borderRadius: '3rem'}}>
                            Cancel
                        </Button>
                        {state.is_room_deleted &&
                            <Button className="mx-2" style={{backgroundColor: "#ce181e", borderRadius: '3rem'}}
                                    variant="contained" onClick={confirmDeleteRoom}>
                                Yes
                            </Button>}
                    </Modal.Footer>
                </Modal>
            </div>
        </Base>
    );
};

export default Home;
