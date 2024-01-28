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
                {login && (
                    <>
                        <Nav className="navbar-nav ml-5 mb-2 mb-lg-0" style={{marginLeft: '8px'}}>
                            {/*<NavItem>*/}
                            {/*    <NavLink id="link" tag={ReactLink} to="/" onClick={logout} className="nav-link">*/}
                            {/*        Logout*/}
                            {/*    </NavLink>*/}
                            {/*</NavItem>*/}


                            {isAdmin && (
                                <>
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

                            {/*/!*    Dropdown     *!/*/}
                            {/*<UncontrolledDropdown nav>*/}
                            {/*    <DropdownToggle*/}
                            {/*        // className="d-flex justify-content-center align-content-center align-items-center"*/}
                            {/*        nav caret>*/}
                            {/*        <i*/}
                            {/*            className="bi bi-person-circle"*/}
                            {/*            style={{marginRight: 7}}*/}
                            {/*        ></i>*/}
                            {/*        {user?.name}*/}
                            {/*        User*/}
                            {/*    </DropdownToggle>*/}
                            {/*    <DropdownMenu id="NavBarMenu2">*/}
                            {/*        /!*{isAdmin && (*!/*/}
                            {/*        /!*    <DropdownItem*!/*/}
                            {/*        /!*        id="drop-down6"*!/*/}
                            {/*        /!*        onClick={navigateToBookedRoomsPage}*!/*/}
                            {/*        /!*    >*!/*/}
                            {/*        /!*        <i*!/*/}
                            {/*        /!*            className="bi bi-person-badge"*!/*/}
                            {/*        /!*            style={{marginRight: 7}}*!/*/}
                            {/*        /!*        ></i>*!/*/}
                            {/*        /!*        Booked Rooms*!/*/}
                            {/*        /!*    </DropdownItem>*!/*/}
                            {/*        /!*)}*!/*/}
                            {/*        /!*{isAdmin && (*!/*/}
                            {/*        /!*    <DropdownItem*!/*/}
                            {/*        /!*        id="drop-down8"*!/*/}
                            {/*        /!*        onClick={navigateToAddRoomPage}*!/*/}
                            {/*        /!*    >*!/*/}
                            {/*        /!*        <i*!/*/}
                            {/*        /!*            className="bi bi-person-plus"*!/*/}
                            {/*        /!*            style={{marginRight: 7, fontSize: 15}}*!/*/}
                            {/*        /!*        ></i>*!/*/}
                            {/*        /!*        Add Room*!/*/}
                            {/*        /!*    </DropdownItem>*!/*/}
                            {/*        /!*)}*!/*/}
                            {/*        <DropdownItem id="signout" onClick={logout}>*/}
                            {/*            <i*/}
                            {/*                className="bi bi-box-arrow-right"*/}
                            {/*                style={{marginRight: 7, fontSize: 15}}*/}
                            {/*            ></i>*/}
                            {/*            Sign out*/}
                            {/*        </DropdownItem>*/}
                            {/*    </DropdownMenu>*/}
                            {/*</UncontrolledDropdown>*/}
                        </Nav>
                    </>
                )
                }
            </Collapse>
        </Navbar>
    )
        ;
};
