import React, {useState} from "react";
import Base from "../Base";
import {Card, CardBody, Col, Container, Form, FormGroup, Row} from "reactstrap";
import {Alert, InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Iconify from "../Iconify";
import Button from "@mui/material/Button";
import {ChangePassword} from "../../service/userservice";
import {toast} from "react-toastify";
import {ToastConfig} from "../../config/toastConfig";

export function ForgotPassword() {
    const [payload, setPayload] = useState({
        name: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [helperText, setHelperText] = useState('');
    const [inputError, setInputError] = useState(false);
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const [passwordError, setPasswordError] = useState(false);


    const ACTION = {
        NAME: 'name',
        NEW_PASSWORD: 'newPassword',
        CONFIRM_PASSWORD: 'confirmPassword',
        SHOW_PASSWORD: 'showPassword'
    }

    function resetFields() {
        setPayload({
            name: '',
            newPassword: '',
            confirmPassword: ''
        })
    }

    const handleChange = (event, field) => {
        setInputError(false);
        setHelperText('');
        setPasswordError(false);
        setPasswordHelperText('');
        let actualValue = event.target.value;
        setPayload({...payload, [field]: actualValue});
    };

    function handleFormSubmit() {
        console.log(`name: ${payload?.name} newPassword: ${payload?.newPassword} confirmPassword: ${payload?.confirmPassword}`)
        ChangePassword(payload?.name, payload?.newPassword, payload?.confirmPassword)
            .then((response) => {
                console.log(response);
                if (response?.status === true) {
                    toast.success(response?.data, ToastConfig);
                    resetFields();
                }
            }).catch((error) => {
            console.log(error);
            if (error?.response?.data?.code === 1) {
                setPasswordError(true);
                setPasswordHelperText(error?.response?.data?.error);
            } else if (error?.response?.data?.code === 2) {
                setInputError(true);
                setHelperText(error?.response?.data?.error);
            } else {
                toast.error(error?.response?.data?.error, ToastConfig);
            }
            // toast.error(error?.response?.data?.error, ToastConfig);
        })
    }

    return (
        <Base>
            <Container>
                <Row
                    className="d-flex justify-content-center"
                    style={{paddingTop: "60px"}}
                >
                    <Col xl={4} lg={4} md={7} sm={10} xs={12}>
                        {/*{error &&*/}
                        {/*    <Alert style={{marginBottom: '20px'}}*/}
                        {/*           severity="error"*/}
                        {/*           sx={{transition: 'opacity 0.5s', opacity: 1}}*/}
                        {/*    >*/}
                        {/*        {errorMessage}*/}
                        {/*    </Alert>*/}
                        {/*}*/}
                        <Card
                            className="rounded-3"
                            style={{
                                padding: '10px',
                                border: "1px solid lightgrey",
                            }}
                        >
                            <CardBody>
                                <h3>Forgot Password</h3>
                                {/* creating form */}
                                <Form style={{textAlign: "left", marginTop: '30px'}}>
                                    {/* email field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField
                                            fullWidth
                                            error={inputError}
                                            helperText={helperText}
                                            name="email" label="Username / Email"
                                            value={payload?.name}
                                            onChange={(e) => handleChange(e, ACTION.NAME)}
                                        />
                                    </FormGroup>

                                    {/* password field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField
                                            fullWidth
                                            error={passwordError}
                                            helperText={passwordHelperText}
                                            name="newPassword"
                                            label="Password"
                                            value={payload?.newPassword}
                                            onChange={(e) => handleChange(e, ACTION.NEW_PASSWORD)}
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end">
                                                            <Iconify
                                                                icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormGroup>

                                    {/* confirm password field */}
                                    <FormGroup className="input-contain mb-4">
                                        <TextField
                                            fullWidth
                                            error={passwordError}
                                            helperText={passwordHelperText}
                                            name="confirmPassword"
                                            label="Confirm password"
                                            value={payload?.confirmPassword}
                                            onChange={(e) => handleChange(e, ACTION.CONFIRM_PASSWORD)}
                                            type={showPassword2 ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword2(!showPassword2)}
                                                            edge="end">
                                                            <Iconify
                                                                icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FormGroup>

                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleFormSubmit}
                                    >
                                        Change password
                                    </Button>

                                    {/*<Container className="text-center">*/}
                                    {/*    <div className="mt-5 d-block justify-content-center">*/}
                                    {/*        <Button variant="contained" type="submit" color="primary" id="submit">*/}
                                    {/*            Login*/}
                                    {/*        </Button>*/}
                                    {/*        <Button*/}
                                    {/*            variant="outlined"*/}
                                    {/*            className="ms-2"*/}
                                    {/*            id="reset"*/}
                                    {/*            onClick={resetData}*/}
                                    {/*        >*/}
                                    {/*            Reset*/}
                                    {/*        </Button>*/}
                                    {/*    </div>*/}
                                    {/*</Container>*/}
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    )
}