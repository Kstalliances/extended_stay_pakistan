import Backdrop from "@mui/material/Backdrop";
import {CircularProgress} from "@mui/material";
import {Card, Col, Form, FormGroup, Row} from "reactstrap";
import TextField from "@mui/material/TextField";
import Base from "./Base";
import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {GetAboutUsById, getUserDetail, UpdateAboutUs} from "../service/userservice";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import JoditEditor from "jodit-react";

export function UpdateAbout() {

    const {aboutUsId} = useParams();
    const [loading, setLoading] = useState(true);
    const [about, setABout] = useState({
        description: '',
        alignment: ''
    });

    // Jodit editor configuration
    const editor = useRef(null);


    const contentFieldChanged = (data) => {
        setABout({...about, description: data})
    };

    function updateAboutUs() {
        console.log('Update');
        UpdateAboutUs(aboutUsId, about?.description, 'center')
            .then((response) => {
                console.log(response);
            }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {

        GetAboutUsById(aboutUsId)
            .then((response) => {
                console.log(response);
                setABout(response?.data);
                setLoading(false);
            }).catch((error) => {
            console.log(error);
        })
    }, [aboutUsId]);

    return (
        <Base>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Row className="d-flex justify-content-center align-content-center">
                {/*{JSON.stringify(about)}*/}
                <Col xxl={10} xl={10} lg={10} md={10} sm={10}>
                    <Card className="m-3 p-4" style={{textAlign: 'left'}}>
                        <h3>Update About us</h3>
                        <Form onSubmit={updateAboutUs}>
                            <FormGroup>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': {m: 1},
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <JoditEditor
                                        name="about"
                                        ref={editor}
                                        value={about?.description}
                                        onChange={contentFieldChanged}
                                        // config={config}
                                    />
                                </Box>
                            </FormGroup>
                            <Button type="submit" variant="contained">
                                <span>Update</span>
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Base>
    )

}