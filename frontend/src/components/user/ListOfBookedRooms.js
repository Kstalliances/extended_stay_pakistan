import React, {useEffect, useReducer, useState} from 'react';
import {Switch} from "@mui/material";
import {myAxios} from "../../config/cloud";
import {getUserListForAdmin} from "../../service/userservice";
import {Container, Table} from "reactstrap";
import '../../style/TableStyleForUsers.css';
import Button from "@mui/material/Button";
import {deleteRoomFromBookedList} from "../../service/roomsservice";
import DeleteConfirmation from "../DeleteConfirmation";
import Base from "../Base";

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

const UserSwitcher = ({userId, roomId, initialPaymentStatus, checkInDate, checkOutDate}) => {
    const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);

    const handleSwitchChange = async () => {
        // Update the payment status in the backend (MySQL) when the switch is toggled
        try {
            // ApprovePayment(userId, roomId, paymentStatus: !paymentStatus ? 1 : 0).then(response => {
            //     console.log(response);
            // })

            // console.log(`${userId} ${roomId} ${!paymentStatus ? 1 : 0}, ${checkInDate} ${checkOutDate}`)
            const response = await myAxios.put(`/payment-approve`, {
                userId: userId,
                roomId: roomId,
                status: !paymentStatus ? 1 : 0,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate
            });

            window.location.reload(true);

            // console.log(response.data);
            // Assuming the API returns the updated user data
            // setPaymentStatus(response.data.paymentStatus);
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    return (
        <Switch
            checked={paymentStatus === 1}
            onChange={handleSwitchChange}
            // disabled={paymentStatus === 1} // Disable the switch if paymentStatus is 1
        />
    );
};

const ListOfBookedRooms = () => {
        const [users, setUsers] = useState([]);
        const [content, setContent] = useState(true);
        const [page, setPage] = useState(1);
        let i = 1;

        useEffect(() => {
                // Fetch users from the backend using Axios
                getUserListForAdmin(page)
                    .then(response => {
                        // const newArray = [...users];
                        // newArray.push(response);
                        const result = response;
                        // console.log(result);
                        setUsers(result.data);
                        if (result?.data.length > 0) {
                            setContent(false);
                        }
                        // setUsers(...users, response);
                    }).catch(error => {
                    console.error('Error fetching users:', error);
                })
                // const response = await myAxios.get('/api/users');

            }, [page]
        );


        const ACTION = {
            IS_LOADING: 'is-loading',
            USERS: 'users',
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
                case ACTION.USERS:
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
            dispatch({type: ACTION.DELETE_MESSAGE, payload: {deleteMessage: 'Are you sure you want to delete the user'}})
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

        return (
            <Base>
                <div style={{
                    margin: '20px',
                    // border: '1px solid lightgrey',
                    // borderRadius: '1rem',
                    paddingTop: '13px',
                    paddingBottom: '-100px'
                }}>
                    <h3 style={{color: '#1F2544', marginBottom: '15px'}}>Booked Rooms</h3>
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
                            <th style={{backgroundColor: '#B4B4B8'}}>Payment</th>
                            <th style={{backgroundColor: '#B4B4B8'}}>Payment_Status</th>
                            <th style={{backgroundColor: '#B4B4B8'}}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{JSON.stringify(users)}*/}
                        {users &&
                            users?.map(user => (
                                <tr key={user?._id}>
                                    <th scope="row">{user?.count}</th>
                                    <td>{user?.user_name}</td>
                                    <td>{user?.room_type}</td>
                                    <td>{user?.days}
                                    </td>
                                    <td>{user?.total_amount}</td>
                                    <td>
                                        <UserSwitcher userId={user?.user_id} roomId={user.room_id}
                                                      initialPaymentStatus={user?.payment_status}
                                                      checkInDate={user?.start_date} checkOutDate={user?.end_date}/>
                                    </td>
                                    <td>{user?.payment_status === 1 ? <Approved/> : <Pending/>}</td>
                                    <td>
                                        <Button
                                            size='small'
                                            variant="contained"
                                            color="error"
                                            onClick={() => showDeleteModal(user.room_id, user?.start_date, user?.end_date)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {content && (
                        <Container style={{marginTop: '100px', marginBottom: '100px'}}>
                            <h3>No Content here</h3>
                        </Container>
                    )}
                    <Button variant="outlined"
                            onClick={() => setPage(prevPage => prevPage - 1)} disabled={page === 1}>
                        Previous Page
                    </Button>
                    <Button variant="outlined" className="mx-3"
                            onClick={() => setPage(prevPage => prevPage + 1)} disabled={page === users?.totalPages}>
                        Next Page
                    </Button>
                    {/*<Stack className="mt-3 text-align-center" spacing={2}>*/}
                    {/*    <Pagination count={10} variant="outlined" shape="rounded" />*/}
                    {/*</Stack>*/}
                    <DeleteConfirmation showModal={state.displayConfirmationModal} confirmModal={deleteBookedRoom}
                                        hideModal={hideConfirmationModal} type={"type"} id={state.id}
                                        startDate={state.startDate} endDate={state.endDate}
                                        message={state.deleteMessage}/>
                </div>
            </Base>
        );
    }
;

export default ListOfBookedRooms;
