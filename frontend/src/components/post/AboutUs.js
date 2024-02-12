import Base from "../Base";
import {useEffect, useState} from "react";
import {GetAboutUs, getUserDetail, isLoggedIn} from "../../service/userservice";
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import {Container} from "reactstrap";
import {useNavigate} from "react-router-dom";

const Style = {
    fontSize: '48px',
}

export function AboutUs() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [alignment, setAlignment] = useState('center');
    const [about, setABout] = useState('');

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
                // console.log(response.data);
                setABout(response?.data);
                setAlignment(response?.data?.alignment);
            })
    }, []);
    return (
        <Base>
            <Container>
                <div className="mb-3 mt-5">
                    {isAdmin &&
                        <Button variant="contained"
                                onClick={() => gotoUpdateAboutUs(about?._id)}>Edit <EditIcon/></Button>
                    }
                    <h1 style={Style}>About us</h1>
                </div>
                <p style={{textAlign: alignment}}>{about?.description}</p>
            </Container>
        </Base>
    )
}