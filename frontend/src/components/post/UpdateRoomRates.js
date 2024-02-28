import Base from "../Base";
import {Card, Col, Container, Form, FormGroup, Row} from "reactstrap";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import {FormHelperText, InputAdornment} from "@mui/material";
import Button from "@mui/material/Button";
import {GetOneRoomRates, UpdateRoomRate} from "../../service/roomsservice";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {ToastConfig} from "../../config/toastConfig";

export function UpdateRoomRates() {

    const {id} = useParams();
    const [rate, setRate] = useState({
        heading: '',
        sub_heading: '',
        rent: '',
        discount: ''
    });
    const [helperText, setHelperText] = useState('');
    const [helperText2, setHelperText2] = useState('');
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);

    useEffect(() => {
        GetOneRoomRates(id)
            .then((response) => {
                // console.log(response);
                setRate(response.data)
            }).catch((error) => {
            console.log(error);
        })
    }, []);

    function updateRate() {
        UpdateRoomRate(id, rate)
            .then((response) => {
                toast.success('Rate updated successfully', ToastConfig);
            }).catch((error) => {
            console.log(error);
        })
    }

    const handleChange = (event, field) => {
        let actualValue = event.target.value;
        setRate({...rate, [field]: actualValue});
    };


    const handleRent = (event, field) => {
        setError(false);
        setHelperText('');

        let actualValue = event.target.value;
        if (!/^\d*$/.test(actualValue)) {
            setError(true);
            setHelperText('Input must contain only numbers.');
        }
        setRate({...rate, [field]: actualValue});
    }
    const handleDiscount = (event, field) => {
        setError2(false);
        setHelperText2('');

        let actualValue = event.target.value;
        if (!/^\d*$/.test(actualValue)) {
            setError2(true);
            setHelperText2('Input must contain only numbers.');
        }
        setRate({...rate, [field]: actualValue});
    }

    return (
        <Base>
            <Row className="d-flex justify-content-center align-content-center">
                <Col xxl={4} xl={4} lg={4} md={12}>
                    <Card className="m-3 p-4" style={{textAlign: 'left'}}>
                        <h3 className='mb-3'>Update Room Rate</h3>
                        <Form>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="heading"
                                    label="Heading"
                                    variant="standard"
                                    value={rate?.heading}
                                    onChange={(e) => handleChange(e, 'heading')}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="sub_heading"
                                    label="Child Heading"
                                    variant="standard"
                                    value={rate?.sub_heading}
                                    onChange={(e) => handleChange(e, 'sub_heading')}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="rent"
                                    label="Rent"
                                    variant="standard"
                                    value={rate?.rent}
                                    onChange={(e) => handleRent(e, 'rent')}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">Rupees</InputAdornment>,
                                    }}
                                    error={error}
                                    helperText={helperText}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="discount"
                                    label="Discount"
                                    variant="standard"
                                    value={rate?.discount}
                                    onChange={(e) => handleDiscount(e, 'discount')}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                    }}
                                    error={error2}
                                    helperText={helperText2}
                                    required
                                />
                            </FormGroup>
                            <Button onClick={updateRate} variant="contained">
                                Update
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Base>
    )
}