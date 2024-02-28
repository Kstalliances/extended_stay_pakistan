import Base from "../Base";
import React, {useEffect, useState} from "react";
import {GetAboutUs, getUserDetail, isLoggedIn} from "../../service/userservice";
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import {CardText, Container} from "reactstrap";
import {useNavigate} from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import {CircularProgress} from "@mui/material";

const Style = {
    fontSize: '48px',
}

export function AboutUs() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [alignment, setAlignment] = useState('center');
    const [about, setABout] = useState('');
    const [loading, setLoading] = useState(true);

    function gotoUpdateAboutUs(aboutUsId) {
        console.log(aboutUsId);
        // if (isLoggedIn()) {
        navigate("/about/" + aboutUsId);
        // }
    }

    function handleAdmin(user) {
        if (user?.data?.userRole == 'ADMIN') {
            setIsAdmin(true);
        }
    }

    useEffect(() => {
        handleAdmin(getUserDetail());

        GetAboutUs()
            .then((response) => {
                // console.log(response);
                setLoading(false);
                setABout(response?.data);
                setAlignment(response?.data?.alignment);

                setTimeout(() => {
                    if (!response.data) {
                        window.location.reload(true);
                    }
                }, 3000);
            }).catch((error) => {

        })
    }, []);
    return (
        <Base>
            {/* Loading... */}
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Container>
                <div className="mb-3 mt-5">
                    {isAdmin &&
                        <Button variant="contained"
                                onClick={() => gotoUpdateAboutUs(about?._id)}>Edit <EditIcon/></Button>
                    }
                    <h1 style={Style}>About us</h1>
                </div>
                <CardText dangerouslySetInnerHTML={{__html: about?.description}}></CardText>
                {/*<p style={{textAlign: alignment}}>dangerouslySetInnerHTML={{__html: about?.description}}</p>*/}
            </Container>
        </Base>
    )
}