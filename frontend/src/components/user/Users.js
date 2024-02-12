import Base from "../Base";
import {Container, Table} from "reactstrap";
import React, {useEffect, useState} from "react";
import {GetUsers} from "../../service/userservice";
import {CircularProgress} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";

export function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(true);
    const [count, setCount] = useState('');
    useEffect(() => {
        GetUsers().then((response) => {
            // console.log(response);
            setLoading(false);
            setUsers(response?.data);
            if (response?.data.length > 0) {
                setContent(false);
            }
            setCount(response?.total_users);
        })
    }, []);

    return (
        <Base>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <div style={{
                margin: '20px',
                // border: '1px solid lightgrey',
                // borderRadius: '1rem',
                paddingTop: '13px',
                paddingBottom: '-100px'
            }}>
                <h3 style={{color: '#1F2544', marginBottom: '15px'}}>Registered User</h3>
                <Table responsive hover style={{borderRadius: '1rem'}}>
                    <thead>
                    <tr>
                        <th style={{backgroundColor: '#B4B4B8'}} className="custom-heading">Sr_#</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Name</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Email</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>Phone</th>
                        <th style={{backgroundColor: '#B4B4B8'}}>User Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users && (
                        users.map(user => (
                            <tr key={user?._id}>
                                <th>{user?.count}</th>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>{user?.phone}</td>
                                <td>{user?.role}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </Table>
                {content && (
                    <Container style={{marginTop: '100px', marginBottom: '100px'}}>
                        <h3>No Content here</h3>
                    </Container>
                )}
                <h5 style={{textAlign: 'left', marginLeft: '15px'}}>Total users: {count}</h5>
            </div>
        </Base>
    )
}