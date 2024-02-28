import Base from "../Base";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getRoomById, UpdateUserRoomById} from "../../service/roomsservice";
import {Card, Col, Form, FormGroup, Input, Row} from "reactstrap";
import TextField from "@mui/material/TextField";
import {Alert, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {getUserDetail} from "../../service/userservice";
import Backdrop from "@mui/material/Backdrop";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import {ToastConfig} from "../../config/toastConfig";
import {toast} from "react-toastify";
import EmptyImage from '../../img/EmptyImage.PNG';


const DefaultImageStyle = {
    maxWidth: '20%',
    margin: '10px',
    padding: '8px',
    border: '2px solid #40A2E3',
    borderRadius: '15px'
}
export const OldUpdateRoom = () => {
    const {roomId} = useParams();
    const [publicIds, setPublucIds] = useState('');
    const [image, setImage] = useState(undefined);
    const [image2, setImage2] = useState(undefined);
    const [image3, setImage3] = useState(undefined);
    const [userId, setUserId] = useState();
    const [isRoomAdded, setIsRoomAdded] = useState(false);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState({
        room_img_url: '',
        room_img_public_id: ''
    });
    const [imageUrl2, setImageUrl2] = useState({
        room_img_url: '',
        room_img_public_id: ''
    });
    const [imageUrl3, setImageUrl3] = useState({
        room_img_url: '',
        room_img_public_id: ''
    });
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);

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
                // console.log(response?.images);
                // console.log(`image1: ${image} image2: ${image2} image3: ${image3}`)
                const publicIds = response?.images?.map(image => image.room_img_public_id);

                // Joining the publicIds into a comma-separated string
                const publicIdsString = publicIds.join(',');
                console.log("Public Ids: ", publicIdsString);
                setPublucIds(publicIdsString);

                setRoom(response);
                // if (response?.images?.[0] != null) {
                //     setImageUrl({
                //         room_img_url: response?.images?.[0].room_img_url,
                //         room_img_public_id: response?.images?.[0]?.room_img_public_id
                //     });
                // }
                // if (response?.images?.[1] != null) {
                //     setImageUrl2({
                //         room_img_url: response?.images?.[1].room_img_url,
                //         room_img_public_id: response?.images?.[1]?.room_img_public_id
                //     });
                // }
                // if (response?.images?.[3] != null) {
                //     setImageUrl3({
                //         room_img_url: response?.images?.[2].room_img_url,
                //         room_img_public_id: response?.images?.[2]?.room_img_public_id
                //     });
                // }
                setLoading(false);
            }).catch(error => {
            toast.error('Error fetching room', ToastConfig);
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
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }
        // continue with file processing
        if (event.target && event.target.files[0]) {

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
                        setImageUrl({room_img_url: URL.createObjectURL(blob)});
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
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }
        // continue with file processing
        if (event.target && event.target.files[0]) {
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
                        setImageUrl2({room_img_url: URL.createObjectURL(blob)});
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
            toast.error("Only chose jpeg, jpg and png images.", ToastConfig);
            return;
        }
        // continue with file processing
        if (event.target && event.target.files[0]) {
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
                        setImageUrl3({room_img_url: URL.createObjectURL(blob)});
                        setImage3(blob);
                    }, selectedFile.type);
                };
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    // add room function
    const updateRoom = (event) => {
        setLoader(!loader);
        event.preventDefault();

        // send form data to server
        formData.append('image', image);
        formData.append('image', image2);
        formData.append('image', image3);
        formData.append('room_img_public_ids', publicIds);

        for (const key in room) {
            formData.append(key, room[key]);
        }
        formData.append('data', JSON.stringify(room));

        UpdateUserRoomById(formData, userId, roomId)
            .then((response) => {
                window.scroll(0, 0);
                setIsRoomAdded(true);
                setLoader(false);
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
                        <Form>
                            {/* Image selection */}
                            {imageUrl && (
                                <img src={imageUrl?.room_img_url || EmptyImage}
                                     alt="Room image"
                                     style={DefaultImageStyle}/>
                            )}
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
                                    accept="image/*"
                                />
                            </FormGroup>
                            {imageUrl2 && (
                                <img src={imageUrl2?.room_img_url || EmptyImage} alt="Room image"
                                     style={DefaultImageStyle}/>
                            )}
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
                                    accept="image/*"
                                />
                            </FormGroup>
                            {imageUrl3 && (
                                <img src={imageUrl3?.room_img_url || EmptyImage} alt="Room image"
                                     style={DefaultImageStyle}/>
                            )}
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
                                    fullWidth multiline
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
                            <LoadingButton
                                type="submit"
                                endIcon={<ArrowRightAltIcon/>}
                                onClick={updateRoom}
                                loading={loader}
                                loadingPosition="end"
                                variant="contained"
                            >
                                <span>Update</span>
                            </LoadingButton>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Base>
    )
}