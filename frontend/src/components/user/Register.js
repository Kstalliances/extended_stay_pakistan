import Base from "../Base";
import React, {useEffect, useState} from "react";
import {Card, CardBody, Col, Container, Form, FormGroup, Row,} from "reactstrap";
import TextField from "@mui/material/TextField";
import {Alert, FormHelperText, InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Iconify from "../Iconify";
import {SignUp} from "../../service/userservice";
import Button from "@mui/material/Button";
import logo from "../../img/logo.png";
import {ToastConfig} from "../../config/toastConfig";
import {toast} from "react-toastify";

export const Registration = () => {
    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    const [loginDetail, setlLoginDetail] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const [signUp, setSignUp] = useState(false);
    const [signUpError, setSignUpError] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [helperTextPh, setHelperTextPh] = useState('');

    const handleChange = (event, field) => {
        let actualValue = event.target.value;
        // console.log(actualValue);
        // console.log(field);
        setlLoginDetail({
            ...loginDetail,
            [field]: actualValue,
        });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const twoCharsBeforeAt = /^[^\s@]{4,}@/;
        return regex.test(email) && twoCharsBeforeAt.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        // Check if the phone number consists of exactly 11 digits
        const regex = /^\d{11}$/;
        return regex.test(phoneNumber);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('handle');
        // validation
        if (
            loginDetail.username.trim() === "" ||
            loginDetail.password.trim() === ""
        ) {
            toast.error("Username and password is required", ToastConfig);
            return;
        }

        if (!validateEmail(loginDetail?.email) && !validatePhoneNumber(loginDetail?.phone)) {
            setHelperText('Incorrect email address.');
            setHelperTextPh('Incorrect phone number.')
            return setInputError(true);
        }
        setHelperText("");
        setHelperTextPh("");
        setInputError(false);


        // call the server api for sending data
        SignUp(loginDetail)
            .then((data) => {
                console.log(data);
                setSignUp(true);
                setTimeout(() => {
                    setSignUp(false);
                }, 4000);
                // toast message
                // toast.success("Login successful", config);
            })
            .catch((error) => {
                console.log(error.response.data);
                setSignUpError(true);
                setTimeout(() => {
                    setSignUpError(false);
                }, 4000);
                // toast.error(error, config);
            });
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Base>
            <Container>
                <Row
                    className="d-flex justify-content-center"
                    style={{paddingTop: "60px"}}
                >
                    <Col xl={4} lg={5} md={7} sm={10} xs={12}>
                        {signUp &&
                            <Alert style={{marginBottom: '20px'}}
                                   severity="success"
                                   sx={{transition: 'opacity 0.5s', opacity: 1}}
                            >
                                User created successfully!
                            </Alert>}
                        {signUpError &&
                            <Alert style={{marginBottom: '20px'}}
                                   severity="error"
                                   sx={{transition: 'opacity 0.5s', opacity: 1}}
                            >
                                User already exists!
                            </Alert>}
                        <Card
                            className="rounded-3"
                            style={{
                                padding: '10px',
                                border: "1px solid lightgrey",
                            }}
                        >
                            <img src={logo} width={60} className="m-auto mt-3" alt="Image here"/>
                            <i id="Icon" className="bi bi-person-lock ms-3 mt-3"></i>
                            <p className="m-auto" style={{fontSize: '22px'}}>Welcome</p>
                            <p>Register to continue</p>
                            <CardBody>
                                {/* creating form */}
                                <Form onSubmit={handleFormSubmit} style={{textAlign: "left"}}>
                                    {/* name field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField fullWidth name="name" label="Name"
                                                   onChange={(e) => handleChange(e, "username")}
                                                   value={loginDetail.username}/>
                                    </FormGroup>
                                    {/* email field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField fullWidth name="email" label="Email address" error={inputError}
                                                   onChange={(e) => handleChange(e, "email")}
                                                   value={loginDetail.email} helperText={helperText}/>
                                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                                    </FormGroup>
                                    {/* phone no field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField fullWidth name="phone" label="Phone #" error={inputError}
                                                   onChange={(e) => handleChange(e, "phone")}
                                                   value={loginDetail.phone} helperText={helperTextPh}/>
                                    </FormGroup>

                                    {/* password field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            onChange={(e) => handleChange(e, "password")}
                                            value={loginDetail.password}
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end">
                                                            <Iconify
                                                                icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormGroup>

                                    <Button
                                        fullWidth
                                        size="large" type="submit" variant="contained">
                                        SignUp
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
