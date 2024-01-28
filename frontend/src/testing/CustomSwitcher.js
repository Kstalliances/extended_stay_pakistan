import React, {useEffect, useReducer, useState} from 'react';
import {Switch} from "@mui/material";
import {myAxios} from "../config/cloud";
import {getUserListForAdmin} from "../service/userservice";
import {Table} from "reactstrap";
import '../style/TableStyleForUsers.css';
import Base from "../components/Base";
import Button from "@mui/material/Button";
import {deleteRoomFromBookedList} from "../service/roomsservice";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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

const UserSwitcher = ({userId, roomId, initialPaymentStatus}) => {
    const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
    const handleSwitchChange = async () => {
        // Update the payment status in the backend (MySQL) when the switch is toggled
        try {
            // ApprovePayment(userId, roomId, paymentStatus: !paymentStatus ? 1 : 0).then(response => {
            //     console.log(response);
            // })

            const response = await myAxios.put(`/payment-approve`, {
                userId: userId, roomId: roomId, status: !paymentStatus ? 1 : 0,
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

const UserList = () => {
        const [users, setUsers] = useState([]);
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
                    border: '1px solid lightgrey',
                    borderRadius: '1rem',
                    paddingTop: '13px',
                    paddingBottom: '-100px'
                }}>
                    <Table
                        responsive
                        hover
                        // bordered
                    >
                        <thead>
                        <tr>
                            <th className="custom-heading">Sr_#</th>
                            <th>Name</th>
                            <th>Room_Type</th>
                            <th>Booking_Days</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Payment_Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
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
                                                      initialPaymentStatus={user?.payment_status}/>
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

export default UserList;
