import Base from "./Base";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getRoomById, postRoomData, UpdateUserRoomById} from "../service/roomsservice";
import {Card, Col, Form, FormGroup, Input, Row} from "reactstrap";
import TextField from "@mui/material/TextField";
import {Alert, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import {getUserDetail} from "../service/userservice";
import Backdrop from "@mui/material/Backdrop";

export const UpdateRoom = () => {
    const {roomId} = useParams();
    const [image, setImage] = useState(undefined);
    const [userId, setUserId] = useState();
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const handleChange = (event, field) => {
        let actualValue = event.target.value;
        setRoom({...room, [field]: actualValue});
    };

    useEffect(() => {
        window.scroll(0, 0);
        // get single room detail from backend
        // console.log(roomId);
        getRoomById(roomId)
            .then(response => {
                // console.log(response);
                setRoom(response);
                setImageUrl(response?.room_img_url);
                setLoading(false);
            }).catch(error => {
            // console.log("Error: ", error)
        });

        setUserId(getUserDetail()?.data?.userId);
    }, [roomId]);

    const [room, setRoom] = useState({
        description: '',
        dimensions: '',
        location: '',
        google_map: '',
        contact_name: '',
        contact_no: '',
        user_id: '',
        utility_charges: '',
        additional_person_charges: '',
        charge_per_unit: '',
        wifi: '',
        car_parking: '',
        attached_bath: '',
        meals: '',
        room_service: '',
        washing: '',
        total_rooms: '',
        room_type: '',
    })

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
    const updateRoom = (event) => {
        event.preventDefault();

        // send form data to server
        formData.append('image', image);
        for (const key in room) {
            formData.append(key, room[key]);
        }
        formData.append('data', JSON.stringify(room));

        UpdateUserRoomById(formData, userId, roomId)
            .then((response) => {
                window.scroll(0, 0);
                setIsRoomAdded(true);
                setTimeout(() => {
                    setIsRoomAdded(false);
                }, 2000);

            }).catch((error) => {
            // console.log(error);
            // console.log(error.response.data.status);
        })
    };

    return (
        <Base>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Row className="d-flex justify-content-center align-content-center">
                <Col xxl={8} xl={8} lg={8} md={8} sm={10}>
                    <Card className="m-3 p-4" style={{textAlign: 'left'}}>
                        {isRoomAdded &&
                            <Alert style={{marginBottom: '20px'}}
                                   severity="success"
                                   sx={{transition: 'opacity 0.5s', opacity: 1}}
                            >
                                Room updated successfully!
                            </Alert>
                        }
                        <h3>Update Room</h3>
                        <Form onSubmit={updateRoom}>
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
                                    accept="image/*"
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="room_type"
                                    label="Room type"
                                    variant="standard"
                                    id="room_type"
                                    value={room?.room_type}
                                    onChange={(e) => handleChange(e, ACTION.ROOM_TYPE)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    variant="standard"
                                    id="description"
                                    value={room?.description}
                                    onChange={(e) => handleChange(e, ACTION.DESCRIPTION)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="dimensions"
                                    label="Dimesion"
                                    variant="standard"
                                    value={room?.dimensions}
                                    onChange={(e) => handleChange(e, ACTION.DIMENSION)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="location"
                                    label="Location"
                                    variant="standard"
                                    value={room?.location}
                                    onChange={(e) => handleChange(e, ACTION.LOCATION)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="google_map"
                                    label="Google map link"
                                    variant="standard"
                                    value={room?.google_map}
                                    onChange={(e) => handleChange(e, ACTION.GOOGLE_MAP)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="contact_name"
                                    label="Contact name"
                                    variant="standard"
                                    id="contact_name"
                                    value={room?.contact_name}
                                    onChange={(e) => handleChange(e, ACTION.CONTACT_NAME)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="contact_no"
                                    label="Contact No"
                                    variant="standard"
                                    value={room?.contact_no}
                                    onChange={(e) => handleChange(e, ACTION.CONTACT_NO)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="utility_charges"
                                    label="Utility Charges"
                                    variant="standard"
                                    value={room?.utility_charges}
                                    onChange={(e) => handleChange(e, ACTION.UTILITY_CHARGES)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="additional_person_charges"
                                    label="Total Rooms"
                                    variant="standard"
                                    value={room?.total_rooms}
                                    onChange={(e) => handleChange(e, ACTION.TOTAL_ROOM)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    name="additional_person_charges"
                                    label="Additional Person Charges"
                                    variant="standard"
                                    value={room?.additional_person_charges}
                                    onChange={(e) => handleChange(e, ACTION.ADDITIONAL)}
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
                                        <FormControlLabel value="Y" checked={room?.wifi === 'Y'} control={<Radio/>}
                                                          label="Yes"/>
                                        <FormControlLabel value="N" checked={room?.wifi === 'N'} control={<Radio/>}
                                                          label="No"/>
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
                                        <FormControlLabel value="Y" checked={room?.car_parking === 'Y'}
                                                          control={<Radio/>} label="Yes"/>
                                        <FormControlLabel value="N" checked={room?.car_parking === 'N'}
                                                          control={<Radio/>} label="No"/>
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
                                        <FormControlLabel value="Y" control={<Radio/>} checked={room?.washing === 'Y'}
                                                          label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} checked={room?.washing === 'N'}
                                                          label="No"/>
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
                                        <FormControlLabel value="Y" control={<Radio/>} checked={room?.meals === 'Y'}
                                                          label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>} checked={room?.meals === 'N'}
                                                          label="No"/>
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
                                        <FormControlLabel value="Y" control={<Radio/>}
                                                          checked={room?.attached_bath === 'Y'} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>}
                                                          checked={room?.attached_bath === 'N'} label="No"/>
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
                                        <FormControlLabel value="Y" control={<Radio/>}
                                                          checked={room?.room_service === 'Y'} label="Yes"/>
                                        <FormControlLabel value="N" control={<Radio/>}
                                                          checked={room?.room_service === 'N'} label="No"/>
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