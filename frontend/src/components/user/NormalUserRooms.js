import Base from "../Base";
import {Container, Table} from "reactstrap";
import Button from "@mui/material/Button";
import DeleteConfirmation from "../DeleteConfirmation";
import React, {useEffect, useReducer, useState} from "react";
import {useParams} from "react-router-dom";
import {GetNormalUserBookedRooms} from "../../service/userservice";
import {deleteRoomFromBookedList} from "../../service/roomsservice";


const Approved = () => {
    return (
        <div style={{color: '#279b37', fontWeight: 'bold', textAlign: 'center'}}>
            Approved
        </div>
    )
}

const Pending = () => {
    return (
        <div style={{color: '#fbb034', fontWeight: 'bold', textAlign: 'center'}}>
            Pending
        </div>
    )
}

export function NormalUserRooms() {
    const {userId} = useParams();
    const [user, setUser] = useState('');
    const [roomId, setRoomId] = useState('')
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState();

    const ACTION = {
        IS_LOADING: 'is-loading',
        USER: 'user',
        DISPLAY_CONFIRMATION: 'display-confirmation',
        DELETE_MESSAGE: 'delete-mesasge',
        ROOM_ID: 'id',
        MESSAGE: '',
        MODAL: 'modal',
        START_DATE: 'startDate',
        END_DATE: 'endDate'
    }

    const initialState = {
        isLoadingObj: true,
        userArray: [],
        displayConfirmationModal: false,
        deleteMessage: null,
        id: null,
        message: null,
        modal: false
    };

    function reducer(state, action) {
        switch (action.type) {
            case ACTION.IS_LOADING:
                return {...state, isLoadingObj: action.payload};
            case ACTION.USER:
                return {...state, userArray: action.payload};
            case ACTION.DISPLAY_CONFIRMATION:
                return {...state, displayConfirmationModal: action.payload.displayConfirmationModal};
            case ACTION.DELETE_MESSAGE:
                return {...state, deleteMessage: action.payload.deleteMessage};
            case ACTION.ROOM_ID:
                return {...state, id: action.payload.id};
            case ACTION.START_DATE:
                return {...state, startDate: action.payload.startDate};
            case ACTION.END_DATE:
                return {...state, endDate: action.payload.endDate};
            case ACTION.MODAL:
                return {...state, modal: action.payload.modal};
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    const hideConfirmationModal = () => {
        dispatch({type: ACTION.DISPLAY_CONFIRMATION, payload: {displayConfirmationModal: false}})
    };

    const showDeleteModal = (roomId, startDate, endDate) => {
        // console.log(`${roomId} ${startDate}  ${endDate}`)
        dispatch({type: ACTION.ROOM_ID, payload: {id: roomId}});
        dispatch({type: ACTION.START_DATE, payload: {startDate: startDate}});
        dispatch({type: ACTION.END_DATE, payload: {endDate: endDate}});
        dispatch({type: ACTION.MESSAGE, payload: {message: null}});
        dispatch({
            type: ACTION.DELETE_MESSAGE,
            payload: {deleteMessage: 'Are you sure you want to delete the booked room'}
        })
        dispatch({type: ACTION.DISPLAY_CONFIRMATION, payload: {displayConfirmationModal: true}})
    };

    const deleteBookedRoom = (roomId, startDate, endDate) => {
        deleteRoomFromBookedList(roomId, startDate, endDate)
            .then((response) => {
                // console.log(response);
                window.location.reload(true);
            }).catch((error) => {
            console.log(error);
        })

    }
    useEffect(() => {
        GetNormalUserBookedRooms(userId, page)
            .then((resposne) => {
                console.log(resposne);
                setUser(resposne?.data);
                setTotalPage(resposne?.totalPages);
                // console.log(resposne?.data?.[0].user_id);
                setRoomId(resposne?.data?.[0].user_id);
            }).catch((error) => {
            console.log(error);
        })
    }, [page]);
    return (
        <Base>
            <div style={{
                margin: '20px',
                // border: '1px solid lightgrey',
                // borderRadius: '1rem',
                paddingTop: '13px',
                paddingBottom: '-100px'
            }}>
                <h3 style={{color: '#1F2544', marginBottom: '15px'}}>My Booked Rooms</h3>
                <Table
                    responsive
                    hover
                    // bordered
                >
                    <thead>
                    <tr>
                        <th style={{backgroundColor: '#B4B4B8'}} className="custom-heading">Sr_#</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Name</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Room_Type</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Booking_Days</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Amount</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Payment_Status</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>CheckIn</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>CheckOut</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*{JSON.stringify(users)}*/}
                    {user &&
                        user?.map(user => (
                            <tr key={user?._id}>
                                <th scope="row">{user?.count}</th>
                                <td>{user?.user_name}</td>
                                <td>{user?.room_type}</td>
                                <td>{user?.days}
                                </td>
                                <td>{user?.total_amount}</td>
                                <td>{user?.payment_status === 1 ? <Approved/> : <Pending/>}</td>
                                <td>{user?.start_date}</td>
                                <td>{user?.end_date}</td>
                                <td>
                                    <Button
                                        size='small'
                                        variant="contained"
                                        color="error"
                                        onClick={() => showDeleteModal(user.room_id, user?.start_date, user?.end_date)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {!user && (
                    <Container style={{marginTop: '100px', marginBottom: '100px'}}>
                        <h3>No Content here</h3>
                    </Container>
                )}
                <Button variant="outlined"
                        onClick={() => setPage(prevPage => prevPage - 1)} disabled={page === 1}>
                    Previous Page
                </Button>
                <Button variant="outlined" className="mx-3"
                        onClick={() => setPage(prevPage => prevPage + 1)} disabled={page === user?.totalPages}>
                    Next Page
                </Button>
                {/*<Stack className="mt-3 text-align-center" spacing={2}>*/}
                {/*    <Pagination count={10} variant="outlined" shape="rounded"/>*/}
                {/*</Stack>*/}
                <DeleteConfirmation showModal={state.displayConfirmationModal} confirmModal={deleteBookedRoom}
                                    hideModal={hideConfirmationModal} type={"type"} id={state.id}
                                    startDate={state.startDate} endDate={state.endDate}
                                    message={state.deleteMessage}/>
            </div>
        </Base>
    );
}