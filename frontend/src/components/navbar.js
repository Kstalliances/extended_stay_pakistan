import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min";
import {useEffect, useState} from "react";
import {NavLink as ReactLink, useNavigate} from "react-router-dom";
import logo from "../img/logo.png";
import '../style/navbar.css';

import {Fade as Hamburger} from "hamburger-react";
import {Collapse, Nav, Navbar, NavbarBrand, NavItem, NavLink,} from "reactstrap";
import {doLogout, getUserDetail, isLoggedIn} from "../service/userservice";
import {Avatar} from "@mui/material";
import {deepPurple} from "@mui/material/colors";

export const Navbar5 = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(false);
    const [login, setLogin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState();
    const [username, setUsername] = useState();
    const logout = () => {
        doLogout(() => {
            // logged out
            setLogin(false);
            navigate("/");
            window.location.reload(true);
        });
    };

    const navigateToBookedRoomsPage = () => {
        navigate("/user/settings");
    }

    const navigateToAddRoomPage = () => {
        navigate("/user/add-room");
    }

    const navigateToNormalUserBookedRoomPage = () => {
        navigate('/booked-rooms/' + userId);
    }

    function handleAdmin(user) {
        if (user?.data?.userRole == 'ADMIN') {
            setIsAdmin(true);
        }

    }

    useEffect(() => {
        setLogin(isLoggedIn());
        console.log();
        setUsername(getUserDetail()?.data?.username.substring(0, 1).toUpperCase());
        setUser(getUserDetail()?.data?.username);
        setUserId(getUserDetail()?.data?.userId);
        handleAdmin(getUserDetail());
    })
    return (

        // navbar fixed navbar-expand-md navbar-light bg-body-secondary
        <Navbar
            fixed=""
            className="navbar navbar-expand-md navbar-dark p-3 p-lg-0"
        >
            <NavbarBrand tag={ReactLink} to="/">
                <img src={logo} alt="image_here" width={40}/>
                <span style={{fontSize: '14px', marginLeft: '8px'}}>Extended Stay Pakistan</span>
            </NavbarBrand>
            <div className="hamburger-icon">
                <Hamburger toggled={isOpen} toggle={setIsOpen} direction={"right"}/>
                {/*<Hamburger toggled={isOpen} toggle={setIsOpen} direction={"right"}/>*/}
            </div>
            <Collapse isOpen={isOpen} navbar>
                <Nav className="me-auto navbar-nav ml-5 mb-2 mb-lg-0" navbar/>
                <Nav className="navbar-nav ml-5 mb-2 mb-lg-0">
                    <NavItem className="nav-link">
                        <NavLink tag={ReactLink} to="/about">
                            About Us
                        </NavLink>
                    </NavItem>
                </Nav>

                {/* Login and sign up */}
                {!login && (
                    <Nav className="navbar-nav ml-5 mb-2 mb-lg-0">
                        <NavItem>
                            <NavLink id="link" tag={ReactLink} to="/login" className="nav-link">
                                Login
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink id="link1" tag={ReactLink} to="/signup">
                                Register
                            </NavLink>
                        </NavItem>
                    </Nav>
                )}

                {/* Admin can see => Add Room / Booked Rooms / Users */}
                {login && (
                    <>
                        <Nav className="navbar-nav ml-2 mb-2 mb-lg-0">
                            {isAdmin && (
                                <>
                                    <NavItem>
                                        <NavLink id="link" tag={ReactLink} to="/user/users" className="nav-link">
                                            Users
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink id="link" tag={ReactLink} to="/user/settings" className="nav-link">
                                            Booked Rooms
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink id="link" tag={ReactLink} to="/user/add-room" className="nav-link">
                                            Add Room
                                        </NavLink>
                                    </NavItem>
                                </>
                            )}
                            <NavItem className="my-room">
                                <NavLink onClick={navigateToNormalUserBookedRoomPage}>
                                    My Rooms
                                </NavLink>
                            </NavItem>
                            <NavItem className="signout">
                                <NavLink onClick={logout}>
                                    Sign out
                                </NavLink>
                            </NavItem>
                            <NavItem
                                className="d-flex justify-content-center align-content-center align-items-center">
                                <Avatar sx={{width: 35, height: 35, bgcolor: deepPurple[500]}}>{username}</Avatar>
                            </NavItem>

                            <NavItem className="username">
                                <NavLink>
                                    {user}
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </>
                )}
            </Collapse>
        </Navbar>
    )
        ;
};
