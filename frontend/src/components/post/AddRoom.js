import {Card, Col, Form, FormGroup, Input, Row} from "reactstrap";
import Base from "../Base";
import TextField from "@mui/material/TextField";
import {Alert, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import {getUserDetail} from "../../service/userservice";
import {postRoomData} from "../../service/roomsservice";
import {useNavigate} from "react-router-dom";
import {ToastConfig} from "../../config/toastConfig";
import {toast} from "react-toastify";
import EmptyImage from "../../img/EmptyImage.PNG";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import LoadingButton from "@mui/lab/LoadingButton";


const DefaultImageStyle = {
    maxWidth: '30%',
    margin: '10px',
    padding: '8px',
    border: '2px solid #40A2E3',
    borderRadius: '15px'
}
export const AddRoom = () => {

    const [room, setRoom] = useState();
    const [image, setImage] = useState(undefined);
    const [image2, setImage2] = useState(undefined);
    const [image3, setImage3] = useState(undefined);
    const [userId, setUserId] = useState();
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');
    const [loader, setLoader] = useState(false);
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
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }

        // console.log(event.target.files[0]);
        // continue with file processing
        if (event.target && event.target.files[0]) {
            // dispatch({type: ACTION.IMAGE, payload: {imageFile: event.target.files[0]}});

            // Reduce image size
            const selectedFile = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800; // Adjust as needed
                    const maxHeight = 600; // Adjust as needed
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        setImageUrl(URL.createObjectURL(blob));
                        setImage(blob);
                    }, selectedFile.type);
                };
            };

            reader.readAsDataURL(selectedFile);
        }
    }
    const handleFileInput2 = (event) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const file = event?.target?.files[0];
        if (!allowedTypes.includes(file.type)) {
            // show an error message or throw an exception
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }

        // console.log(event.target.files[0]);
        // continue with file processing
        if (event.target && event.target.files[0]) {
            // dispatch({type: ACTION.IMAGE, payload: {imageFile: event.target.files[0]}});

            // Reduce image size
            const selectedFile = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800; // Adjust as needed
                    const maxHeight = 600; // Adjust as needed
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        setImageUrl2(URL.createObjectURL(blob));
                        setImage2(blob);
                    }, selectedFile.type);
                };
            };

            reader.readAsDataURL(selectedFile);
        }
    }
    const handleFileInput3 = (event) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const file = event?.target?.files[0];
        if (!allowedTypes.includes(file.type)) {
            // show an error message or throw an exception
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }

        // console.log(event.target.files[0]);
        // continue with file processing
        if (event.target && event.target.files[0]) {
            // dispatch({type: ACTION.IMAGE, payload: {imageFile: event.target.files[0]}});

            // Reduce image size
            const selectedFile = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800; // Adjust as needed
                    const maxHeight = 600; // Adjust as needed
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        setImageUrl3(URL.createObjectURL(blob));
                        setImage3(blob);
                    }, selectedFile.type);
                };
            };

            reader.readAsDataURL(selectedFile);
        }
    }

    // add room function
    const addRoom = (event) => {
        setLoader(!loader);
        event.preventDefault();

        // send form data to server
        formData.append('image', image);
        formData.append('image', image2);
        formData.append('image', image3);
        for (const key in room) {
            formData.append(key, room[key]);
        }
        // formData.append('data', JSON.stringify(room));

        postRoomData(formData, userId)
            .then((response) => {
                // console.log(response);
                if (response.status === true) {
                    setIsRoomAdded(true);
                    setLoader(false);
                    setTimeout(() => {
                        setIsRoomAdded(false);
                    }, 8000);
                } else {
                    // If response is not successful after 2 seconds, show alert
                    setTimeout(() => {
                        if (!response.status) {
                            toast.error('Check your internet connection....', ToastConfig);
                        }
                    }, 2000);
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
                            <img src={imageUrl !== '' ? imageUrl : EmptyImage}
                                 alt="Room image"
                                 style={DefaultImageStyle}/>
                            <FormGroup className="my-3">
                                {/*<Label for="file"></Label>*/}
                                <FormLabel id="demo-radio-buttons-group-label" className="mb-2">
                                    Image File One
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
                            <img src={imageUrl2 !== '' ? imageUrl2 : EmptyImage}
                                 alt="Room image"
                                 style={DefaultImageStyle}/>
                            <FormGroup className="my-3">
                                {/*<Label for="file"></Label>*/}
                                <FormLabel id="demo-radio-buttons-group-label" className="mb-2">
                                    Image File Two
                                </FormLabel>
                                <Input
                                    // bsSize=""
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={handleFileInput2}
                                    required
                                />
                            </FormGroup>
                            <img src={imageUrl3 !== '' ? imageUrl3 : EmptyImage}
                                 alt="Room image"
                                 style={DefaultImageStyle}/>
                            <FormGroup className="my-3">
                                {/*<Label for="file"></Label>*/}
                                <FormLabel id="demo-radio-buttons-group-label" className="mb-2">
                                    Image File Three
                                </FormLabel>
                                <Input
                                    // bsSize=""
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={handleFileInput3}
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
                                    multiline required
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
                            <LoadingButton
                                type="submit"
                                endIcon={<ArrowRightAltIcon/>}
                                loading={loader}
                                loadingPosition="end"
                                variant="contained"
                            >
                                <span>Add Room</span>
                            </LoadingButton>
                            {/*<Button type="submit" variant="contained">Submit</Button>*/}
                            {/*<Button type="reset" className="mx-3" variant="contained">Reset</Button>*/}
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Base>
    )
}