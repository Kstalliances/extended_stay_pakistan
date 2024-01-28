import {Card, Col, Form, FormGroup, Input, Row} from "reactstrap";
import Base from "./Base";
import TextField from "@mui/material/TextField";
import {Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {getUserDetail} from "../service/userservice";
import {postRoomData} from "../service/roomsservice";
import {useNavigate} from "react-router-dom";

export const AddRoom = () => {

    const [room, setRoom] = useState();
    const [image, setImage] = useState(undefined);
    const [userId, setUserId] = useState();
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const handleChange = (event, field) => {
        let actualValue = event.target.value;
        setRoom({...room, [field]: actualValue});
    };

    const ACTION = {
        IMAGE: 'imageFile',
        ROOM_TYPE: 'room_type',
        DESCRIPTION: 'description',
        DIMENSION: 'dimensions',
        LOCATION: 'location',
        GOOGLE_MAP: 'google_map',
        CONTACT_NAME: 'contact_name',
        CONTACT_NO: 'contact_no',
        UTILITY_CHARGES: 'utility_charges',
        TOTAL_ROOM: 'total_rooms',
        ADDITIONAL: 'charge_per_unit',
        WIFI: 'wifi',
        CAR_PARK: 'car_parking',
        MEALS: 'meals',
        ATTACHED_BATH: 'attached_bath',
        ROOM_SERVICE: 'room_service',
        WASHING: 'washing',
    };

    const formData = new FormData();

    // validate image file
    const handleFileInput = (event) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const file = event?.target?.files[0];
        if (!allowedTypes.includes(file.type)) {
            // show an error message or throw an exception
            // toast.error("Only chose jpeg, jpg and png images.", ToastConfig);

            alert('Only chose jpeg, jpg and png images.')
            return;
        }

        // console.log(event.target.files[0]);
        // continue with file processing
        if (event.target && event.target.files[0]) {
            // dispatch({type: ACTION.IMAGE, payload: {imageFile: event.target.files[0]}});
            setImage(file);
            const fileUrl = URL.createObjectURL(file);
            setImageUrl(fileUrl);
        }
    }

    // add room function
    const addRoom = (event) => {
        event.preventDefault();

        // send form data to server
        formData.append('image', image);
        for (const key in room) {
            formData.append(key, room[key]);
        }
        // formData.append('data', JSON.stringify(room));

        postRoomData(formData, userId)
            .then((response) => {
                // console.log(response);
                if (response.status === true) {
                    setIsRoomAdded(true);
                    setTimeout(() => {
                        setIsRoomAdded(false);
                    }, 8000);
                }
                window.scroll(0, 0);
            }).catch((error) => {
            // console.log(error.response.data.status);
        })
    };

    useEffect(() => {
        setUserId(getUserDetail()?.data?.userId);
    }, []);

    return (
        <Base>
            <Row className="d-flex justify-content-center align-content-center">
                <Col xxl={8} xl={8} lg={8} md={8} sm={10}>
                    <Card className="m-3 p-4" style={{textAlign: 'left'}}>
                        {isRoomAdded &&
                            <Alert style={{marginBottom: '20px'}}
                                   severity="success"
                                   sx={{transition: 'opacity 0.5s', opacity: 1}}
                            >
                                Room added successfully!
                            </Alert>
                        }
                        <h3>Add Room</h3>
                        <Form onSubmit={addRoom}>
                            {imageUrl && (
                                <img src={imageUrl} alt="Room image" style={{maxWidth: '20%'}}/>
                            )}
                            <FormGroup className="my-3">
                                {/*<Label for="file"></Label>*/}
                                <FormLabel id="demo-radio-buttons-group-label" className="mb-2">
                                    Image File
                                </FormLabel>
                                <Input
                                    // bsSize=""
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={handleFileInput}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="room_type"
                                    label="Room type"
                                    variant="standard"
                                    id="room_type"
                                    onChange={(e) => handleChange(e, ACTION.ROOM_TYPE)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    variant="standard"
                                    id="description"
                                    onChange={(e) => handleChange(e, ACTION.DESCRIPTION)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="dimensions"
                                    label="Dimesion"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.DIMENSION)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="location"
                                    label="Location"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.LOCATION)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="google_map"
                                    label="Google map link"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.GOOGLE_MAP)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="contact_name"
                                    label="Contact name"
                                    variant="standard"
                                    id="contact_name"
                                    onChange={(e) => handleChange(e, ACTION.CONTACT_NAME)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="contact_no"
                                    label="Contact No"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.CONTACT_NO)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="utility_charges"
                                    label="Utility Charges"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.UTILITY_CHARGES)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="additional_person_charges"
                                    label="Total Rooms"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.TOTAL_ROOM)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="additional_person_charges"
                                    label="Additional Person Charges"
                                    variant="standard"
                                    onChange={(e) => handleChange(e, ACTION.ADDITIONAL)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Wifi</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        onChange={(e) => handleChange(e, ACTION.WIFI)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Car Paking</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        onChange={(e) => handleChange(e, ACTION.CAR_PARK)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Washing</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        onChange={(e) => handleChange(e, ACTION.WASHING)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Meals</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={room}
                                        onChange={(e) => handleChange(e, ACTION.MEALS)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>

                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Attached Bath</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={room}
                                        onChange={(e) => handleChange(e, ACTION.ATTACHED_BATH)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{textAlign: 'left'}}>
                                    <FormLabel id="demo-radio-buttons-group-label">Room Service</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={room}
                                        onChange={(e) => handleChange(e, ACTION.ROOM_SERVICE)}
                                    >
                                        <FormControlLabel value="Y" control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} label="No"/>
                                    </RadioGroup>
                                </FormControl>
                            </FormGroup>
                            <Button type="submit" variant="contained">Submit</Button>
                            <Button type="reset" className="mx-3" variant="contained">Reset</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Base>
    )
}