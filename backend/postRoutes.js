const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const jwt = require('jsonwebtoken');
const END_POINT = require('./globalContants');
const {errors} = require("formidable");
const ROOM = require("./schemas/rooms");
const ROOM_DETAIL = require("./schemas/room_detail");
const ROOM_PRICE = require("./schemas/room_price");
const BOOKED_ROOMS = require("./schemas/booked_rooms");
const USER = require("./schemas/user");
const ABOUT = require("./schemas/about");
const mongoose = require("mongoose");
const {UploadToCloudinary, DeleteImage} = require("./CloudinaryService");

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dyhuht5kj",
    api_key: "637927817868136",
    api_secret: "SHWcKEFwziwWJxupOTKU8BZ7U7k",
});

// zaman
// cloudinary.config({
//     cloud_name: 'du8cfubr9',
//     api_key: '742255532794584',
//     api_secret: 'vRoWxubXnFd7IEfDCLV_kB1SuOE'
// });

// zunairpri@gmail.com
cloudinary.config({
    cloud_name: 'du8cfubr9',
    api_key: '742255532794584',
    api_secret: 'vRoWxubXnFd7IEfDCLV_kB1SuOE'
});

// Configure Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// JWT Secret Key
const secretKey = 'r0omB0ok!';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
        errorResponse(res, 401, 'Unauthorized: Token missing');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            errorResponse(res, 401, 'Unauthorized: Token expired or invalid');
        }

        req.user = decoded;
        next();
    });
};

// ADD ROOM POST API
router.post(END_POINT.ADD_ROOM, verifyToken, upload.array('image', 3), async (req, res) => {
        console.log(new Date(), "===== POST REQUEST RECEIVED =====");

        try {
            const files = req.files;
            const userId = req.params.userId;

            const {
                description, dimensions, location, google_map, contact_name, contact_no, utility_charges,
                additional_person_charges, charge_per_unit, wifi, car_parking, meals, attached_bath,
                room_service, washing, total_rooms, room_type
            } = req.body;

            if (!files || files.length === 0) {
                errorResponse(res, 400, 'No file uploaded');
            }

            // Check if required data is provided
            if (!description || !dimensions || !location || !contact_no) {
                errorResponse(res, 400, 'Enter the required data');
            }

            const uploadPromises = files.map(file =>
                UploadToCloudinary(file.buffer)
                    .then(result => {
                        return {
                            room_img_url: result.imageUrl,
                            room_img_public_id: result.publicId,
                        };
                    })
                    .catch(error => {
                        console.error('ERROR UPLOADING FILE TO CLOUDINARY:', error);
                        throw error; // Propagate the error
                    })
            );

            const images = await Promise.all(uploadPromises);

            console.log('FILE UPLOADED SUCCESSFULLY TO CLOUDINARY: ', images);

            const room = new ROOM({
                images: images,
                description: description,
                dimensions: dimensions,
                location: location,
                google_map: google_map,
                contact_name: contact_name,
                contact_no: contact_no,
                user_id: userId,
                utility_charges: utility_charges,
                additional_person_charges: additional_person_charges,
                charge_per_unit: charge_per_unit,
                wifi: wifi,
                car_parking: car_parking,
                meals: meals,
                attached_bath: attached_bath,
                room_service: room_service,
                washing: washing,
                total_rooms: total_rooms,
                room_type: room_type,
            });

            const savedRoom = await room.save();

            console.log("ROOM ADDED WITH ID: ", savedRoom._id);
            successResponse(res, savedRoom);

        } catch (error) {
            console.log(`EXCEPTION: ${error}`);
            errorResponse(res, 500, 'Error writing data to MongoDB');
        }
    }
);

// UPDATE ROOM POST BY USER API
router.put(
    END_POINT.UPDATE_USER_ROOM,
    verifyToken,
    upload.array('image', 3),
    async (req, res) => {
        console.log(new Date(), ' ======= UPDATE ROOM REQUEST RECEIVED =======');
        // Parameters
        const files = req.files;
        const roomId = req.params.roomId;
        const userId = req.params.userId;
        let imageUrl;

        console.log(`USER_ID: ${userId} ROOM_ID: ${roomId}`);
        let publicIds = req.body.room_img_public_ids;

        // Request body
        const {
            description,
            dimensions,
            location,
            google_map,
            contact_name,
            contact_no,
            utility_charges,
            additional_person_charges,
            charge_per_unit,
            wifi,
            car_parking,
            meals,
            attached_bath,
            room_service,
            washing,
            total_rooms,
            room_type,
        } = req.body;

        try {
            // If new files are provided, update images on Cloudinary
            if (files && files.length > 0) {
                if (publicIds && publicIds.length > 0) {
                    // Delete old images from Cloudinary
                    const arrayOfValues = publicIds.split(',');
                    for (const publicId of arrayOfValues) {
                        await DeleteImage(publicId);
                    }
                }

                // Delete images field from DB
                const updatedRoom = await ROOM.findOneAndUpdate(
                    {_id: roomId},
                    {$unset: {images: ""}},
                    {new: true}
                );
                if (updatedRoom) {
                    console.log('Successfully removed the images field from the room document.');
                } else {
                    console.log('Room document not found.');
                }


                // Upload new images to Cloudinary
                const uploadPromises = files.map((file) => {
                    return UploadToCloudinary(file.buffer)
                        .then((result) => {
                            // console.log('FILE UPLOADED SUCCESSFULLY TO CLOUDINARY:', result);
                            // console.log(`IMAGE_URL: ${result.imageUrl} PUBLIC_ID: ${result.publicId}`);
                            return {
                                room_img_url: result.imageUrl,
                                room_img_public_id: result.publicId,
                            };
                        })
                        .catch((error) => {
                            console.error('ERROR UPLOADING FILE TO CLOUDINARY:', error);
                            throw error;
                        });
                });

                // Wait for all images to be uploaded
                const images = await Promise.all(uploadPromises);

                // Now you can use the array of uploaded images in your logic
                console.log('UPLOADED IMAGES:', images);

                const body = {
                    description: description,
                    dimensions: dimensions,
                    location: location,
                    google_map: google_map,
                    contact_name: contact_name,
                    contact_no: contact_no,
                    user_id: userId,
                    utility_charges: utility_charges,
                    additional_person_charges: additional_person_charges,
                    charge_per_unit: charge_per_unit,
                    wifi: wifi,
                    car_parking: car_parking,
                    meals: meals,
                    attached_bath: attached_bath,
                    room_service: room_service,
                    washing: washing,
                    total_rooms: total_rooms,
                    room_type: room_type,
                }

                const updateQuery = {};
                if (body) {
                    updateQuery.$set = body;
                }
                if (images && images.length > 0) {
                    updateQuery.$push = {images: {$each: images}};
                }

                console.log('Update query: ', updateQuery);

                const updateRoom = await ROOM.findOneAndUpdate(
                    {_id: roomId},
                    updateQuery,
                    {new: true}
                );
                if (updateRoom) {
                    console.log('Successfully updated the room document.');
                } else {
                    console.log('Room document not found.');
                }

            } else {
                const body = {
                    description: description,
                    dimensions: dimensions,
                    location: location,
                    google_map: google_map,
                    contact_name: contact_name,
                    contact_no: contact_no,
                    user_id: userId,
                    utility_charges: utility_charges,
                    additional_person_charges: additional_person_charges,
                    charge_per_unit: charge_per_unit,
                    wifi: wifi,
                    car_parking: car_parking,
                    meals: meals,
                    attached_bath: attached_bath,
                    room_service: room_service,
                    washing: washing,
                    total_rooms: total_rooms,
                    room_type: room_type
                }
                await ROOM.updateOne({_id: roomId}, body);
            }

            console.log(`ROOM UPDATED FOR USER: ${userId}`);
            res.status(200).json({success: true, data: 'Record updated successfully!'});

        } catch (error) {
            console.error('ERROR UPDATING ROOM:', error);
            res.status(500).json({error: 'Error updating room'});
        }
    }
);

// GET ROOM POST DETAIL API
router.get(END_POINT.GET_ROOMS, async (req, res) => {

    console.log(new Date(), ' ===== GET ROOM DETAIL REQUEST =====');

    try {
        const rooms = await ROOM.find();
        res.status(200).json({
            status: true,
            data: rooms,
        });
    } catch (error) {
        console.error('ERROR FETCHING ROOMS:', error);
        errorResponse(res, 500, 'Internal server error');
    }
});

// GET ROOM POST DETAIL BY ID API
router.get(END_POINT.GET_ROOM_BY_ID, async (req, res) => {

    console.log(new Date(), ' ===== GET ROOM REQUEST =====');
    const roomId = req.params.roomId;
    console.log(`ROOM ID: ${roomId}`);

    try {
        const roomDetail = await ROOM.findById(roomId);

        if (!roomDetail) {
            errorResponse(res, 404, 'Room not found');
        }
        successResponse(res, roomDetail);
    } catch (error) {
        console.error('ERROR FETCHING ROOM DETAILS:', error);
        errorResponse(res, 500, 'Internal server error');
    }
});


// GET ROOM POST DETAIL BY USER API
router.get(END_POINT.GET_USER_ROOMS, async (req, res) => {
    // Fetch all rooms from the database
    const userId = req.params.userId;

    try {
        const roomDetail = await ROOM.find({user_id: userId});

        if (!roomDetail) {
            return res.status(404).json({error: 'Room not found'});
        }

        res.status(200).json({status: true, data: roomDetail});
    } catch (error) {
        console.error('ERROR FETCHING ROOM DETAILS:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// DELETE ROOM POST BY USER API
router.delete(END_POINT.DELETE_USER_ROOM, verifyToken, (req, res) => {

    console.log(new Date().toString(), ' ===== DELETE ROOM REQUEST =====');
    const roomId = req.params.roomId;
    const publicId = req.params.publicId;
    const userId = req.params.userId;
    console.log(`ROOM_ID: ${roomId}\nROOM_IMAGE_PUBLIC_ID: ${publicId}\nUSER_ID: ${userId}`);

    // delete data from cloudinary
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            console.error('ERROR DELETING IMAGE: ', error);
        } else {
            console.log('IMAGE DELETED SUCCESSFULLY: ', result);
        }
    });

    // Perform the delete operation in the database
    try {
        ROOM.deleteOne({_id: roomId})
            .then((result) => {
                if (result.deletedCount > 0) {
                    console.log('Room deleted successfully');
                } else {
                    console.log('Room not found with the given ID');
                }
            })
            .catch((err) => {
                console.error('Error deleting room:', err);
            });
        res.json({success: true, message: 'Room deleted successfully'});
    } catch (error) {
        console.error('ERROR DELETING ROOM:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//UPDATE THE IMAGES
router.put(END_POINT.UPDATE_SINGLE_IMAGE, async (req, res) => {
    console.log("UPDATE IMAGE");

    const roomId = req.body.room_id;
    const oldImageUrl = req.body.old_image_url;
    const newRoomImgUrl = req.body.image_url;

    try {
        // Find the document by room ID and old image URL
        const room = await ROOM.findOne({_id: roomId, 'images.room_img_url': oldImageUrl});

        if (!room) {
            console.log('Room not found or old image URL does not exist.');
            return;
        }

        // Update the specific old image URL with the new URLs
        room.images.forEach(image => {
            if (image.room_img_url === oldImageUrl) {
                // Update the image URL
                image.room_img_url = newImageUrls;
            }
        });

        // Save the updated document
        const updatedRoom = await room.save();
        console.log('Updated room:', updatedRoom);
        res.status(200).json({status: true, message: "Image update successfully", data: updatedRoom});
    } catch (error) {
        console.error('Error updating image value:', error);
    }
});

router.post(END_POINT.CALCULATE_ROOM_RATE, verifyToken, async (req, res) => {

    console.log(new Date(), " ===== CALCULATE ROOM RATE =====");

    // Assuming the request body contains 'startDate' and 'endDate' in the format 'YYYY-MM-DD'
    const {startDate, endDate} = req.body;
    console.log("START DATE:", startDate);
    console.log("END DATE:", endDate);

    const currentDate = new Date(startDate);
    const toDate = new Date(endDate);

    if (toDate < currentDate) {
        return res.json({status: false, data: 'Start date is greater than end date'});
    } else {

        if (!startDate || !endDate) {
            res.status(401).json({status: false, data: 'StartDate and EndDate are required!'});
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        let numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        console.log(numberOfDays);
        let query;
        if (numberOfDays === 0) {
            numberOfDays = 1;
        }
        console.log(numberOfDays);

        // Build the Mongoose query based on the number of days
        if (numberOfDays >= 0 && numberOfDays <= 7) {
            query = 7;
            // const roomPriceDetail = await ROOM_PRICE.findOne({days: numberOfDays});
        } else if (numberOfDays > 7 && numberOfDays <= 30) {
            query = 30;
        } else if (numberOfDays > 30 && numberOfDays <= 90) {
            query = 90;
        } else if (numberOfDays > 90 && numberOfDays <= 180) {
            query = 180;
        } else if (numberOfDays > 180) {
            query = 180;
        }

        console.log("QUERY: ", query);
        const roomPriceDetail = await ROOM_PRICE.findOne({days: query});
        if (!roomPriceDetail) {
            return res.status(404).json({error: 'Room price detail not found'});
        }

        const response = {
            roomId: "",
            rent_per_day: "",
            days: "",
            number_of_days: "",
            rent: "",
            discount: "",
            amount_after_discount: ""

        };
        const originalAmount = roomPriceDetail.rent * numberOfDays;
        const discountPercentage = roomPriceDetail.discount;
        const discountAmount = (originalAmount * discountPercentage) / 100;
        const amountAfterDiscount = originalAmount - discountAmount;

        response.roomId = roomPriceDetail._id;
        response.rent_per_day = roomPriceDetail.rent;
        response.days = roomPriceDetail.days;
        response.number_of_days = numberOfDays;
        response.rent = originalAmount;
        response.discount = discountPercentage;
        response.amount_after_discount = originalAmount;


        res.status(200).json({status: true, data: response});
    }
});

router.post(END_POINT.BOOK_ROOM, async (req, res) => {

    console.log(new Date(), '===== POST REQUEST FOR BOOKING =====')
    const {userId, roomId, days, discount, totalAmount, startDate, endDate} = req.body;

    if (!userId || !roomId || !days || !totalAmount) {
        return res.status(400).json({status: false, error: 'Room is not booked!'});
    }

    try {
        const overlappingBooking = await BOOKED_ROOMS.findOne({
            room_id: roomId,
            $or: [
                {
                    start_date: {$lte: endDate},
                    end_date: {$gte: startDate}
                },
                {
                    start_date: {$gte: startDate},
                    end_date: {$lte: endDate}
                }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({status: false, data: 'Room already booked for the selected dates'});
        }

        const foundUser = await USER.findById(userId);

        if (!foundUser) {
            console.error('USER NOT FOUND');
            return res.status(400).json({status: false, error: 'User not found!'});
        }

        let foundUsername = foundUser.name;

        const foundRoom = await ROOM.findById(roomId);

        if (!foundRoom) {
            console.error('ROOM NOT FOUND');
            return res.status(400).json({status: false, error: 'Room not found!'});
        }

        let foundRoomType = foundRoom.room_type;

        // Display the username in the console
        console.log('USERNAME:', foundUsername);
        // Display the room type in the console
        console.log('ROOM TYPE:', foundRoomType);

        // Create a new BookedRoom instance
        const bookedRoom = new BOOKED_ROOMS({
            user_name: foundUsername,
            user_id: userId,
            room_type: foundRoomType,
            room_id: roomId,
            days: days,
            total_amount: totalAmount,
            discount: discount,
            payment_status: "0",
            start_date: startDate,
            end_date: endDate,
        });

        // Save the bookedRoom instance to the database
        const savedBooking = await bookedRoom.save();

        res.status(200).json({status: true, data: savedBooking});
    } catch (error) {
        console.error('ERROR SAVING BOOKED ROOM:', error);
        res.status(500).json({status: false, data: 'Error saving booked room'});
    }
});

router.get(END_POINT.CHECK_IS_ROOM_BOOKED, async (req, res) => {
    const roomId = req.params.roomId;

    try {
        // Count the number of booked rooms with the specified room_id
        const bookingCount = await BOOKED_ROOMS.countDocuments({room_id: roomId});

        // Determine the status based on the count
        const status = (bookingCount > 0) ? 'Booked' : 'Available';

        res.status(200).json({status: true, data: {Status: status}});
    } catch (error) {
        console.error('Error checking booking status:', error);
        res.status(500).json({status: false, data: 'Error checking booking status'});
    }
});


router.delete(END_POINT.DELETE_ROOM_FROM_BOOKED_ROOM, verifyToken, async (req, res) => {

    const roomId = req.params.roomId;
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    console.log('ROOM_ID: ' + roomId);

    if (!roomId) {
        return res.status(400).json({status: false, data: 'roomId is required!'});
    }

    try {
        // Find and delete the booked room with the specified room_id, start_date, and end_date
        const result = await BOOKED_ROOMS.deleteOne({room_id: roomId, start_date: startDate, end_date: endDate});

        if (result.deletedCount === 0) {
            return res.status(404).json({status: false, data: 'Record not found or already deleted'});
        }

        res.status(200).json({status: true, data: result});
    } catch (error) {
        console.error('Error deleting booked room:', error);
        res.status(500).json({status: false, data: 'Error deleting booked room'});
    }
})

router.get(END_POINT.GET_ROOM_RESERVED_DATES, async (req, res) => {

    console.log(new Date(), 'Get room reserved dates');

    const roomId = req.params.roomId;
    console.log("roomId: " + roomId);

    try {
        // Find the oldest and latest dates for the specified room_id
        const result = await BOOKED_ROOMS.aggregate([
            {$match: {room_id: roomId}},
            {
                $group: {
                    _id: null,
                    oldest_date: {$min: "$start_date"},
                    latest_date: {$max: "$end_date"}
                }
            }
        ]);

        const dates = result[0];
        if (!dates || !dates.oldest_date) {
            return res.status(200).json({status: false, data: 'Record not found!'});
        }

        res.status(200).json({status: true, data: dates});
    } catch (error) {
        console.error('Error getting reserved dates:', error);
        res.status(500).json({status: false, data: 'Error getting reserved dates'});
    }

});

router.get(END_POINT.GET_LIST_OF_ROOM_DATE, async (req, res) => {

    console.log(new Date(), ' ===== Get list of reserved room dates =====');

    const roomId = req.params.roomId;
    console.log("roomId: " + roomId);

    try {
        // Find all documents matching the specified room_id
        const result = await BOOKED_ROOMS.find({room_id: roomId}, {start_date: 1, end_date: 1, _id: 0});

        if (!result || result.length === 0) {
            return res.status(200).json({status: false, data: []});
        }

        // const formattedDatesArray = result.map(item => {
        //     const {start_date, end_date} = formatDates(item.start_date, item.end_date);
        //     return {start_date, end_date};
        // });
        //
        // console.log(formattedDatesArray)
        // const formattedDatesArray = result.map(item => {
        //     const {start_date, end_date} = (item.start_date, item.end_date);
        //     return {start_date, end_date};
        // });

        console.log(result)

        res.status(200).json({status: true, data: result});
    } catch (error) {
        console.error('Error getting reserved room dates:', error);
        res.status(500).json({status: false, data: 'Error getting reserved room dates'});
    }

});

// Assuming formatDates function is defined elsewhere
function formatDates(start_date, end_date) {
    // Assuming start_date and end_date are JavaScript Date objects
    const formatDate = date => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return {
        start_date: formatDate(start_date),
        end_date: formatDate(end_date)
    };
}

// function formatDates(startDate, endDate) {
//     const start_date = new Date(startDate).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//     });
//
//     const end_date = new Date(endDate).toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//     });
//
//     return {start_date, end_date};
// }

// Save data
router.post(END_POINT.ABOUT_US, async (req, res) => {
    try {
        const {description, alignment} = req.body;
        const newAbout = new ABOUT({description, alignment});
        const savedAbout = await newAbout.save();
        successResponse(res, 'Record added successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({error: 'Error saving data'});
    }
});

// Get all data
router.get(END_POINT.ABOUT_US, async (req, res) => {
    try {
        const allAboutData = await ABOUT.find();
        const first = allAboutData[0];
        successResponse(res, first);
    } catch (error) {
        console.error('Error getting data:', error);
        res.status(500).json({error: 'Error getting data'});
    }
});

// Update data by ID
router.put(END_POINT.ABOUT, async (req, res) => {
    try {
        const {description, alignment} = req.body;
        const updatedAbout = await ABOUT.findByIdAndUpdate(
            req.params.id,
            {description, alignment},
            {new: true} // Return the updated document
        );
        successResponse(res, updatedAbout);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({error: 'Error updating data'});
    }
});

// GET ROOM POST DETAIL BY ID API
router.get(END_POINT.ABOUT, async (req, res) => {

    console.log(new Date(), ' ===== GET ABOUT REQUEST =====');
    const id = req.params.id;

    try {
        const aboutDetail = await ABOUT.findById(id);

        if (!aboutDetail) {
            errorResponse(res, 404, 'Record not found');
        }
        successResponse(res, aboutDetail);
    } catch (error) {
        console.error('ERROR FETCHING ROOM DETAILS:', error);
        errorResponse(res, 500, 'Internal server error');
    }
});

// Get normal user booked rooms
router.get(END_POINT.GET_NORMAL_USER_BOOKED_ROOMS, async (request, response) => {
    console.log(new Date(), ' ===== GET NORMAL USER BOOKED ROOMS =====');

    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 5;
    const userId = request.params.userId;
    try {

        const totalItems = await BOOKED_ROOMS.countDocuments();
        const paginatedData = await BOOKED_ROOMS.find({user_id: userId})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        const dataWithFormattedDates = paginatedData.map((room, index) => {
            const options = {day: '2-digit', month: 'short', year: 'numeric'};
            const formattedStartDate = new Date(room.start_date).toLocaleDateString('en-GB', options);
            const formattedEndDate = new Date(room.end_date).toLocaleDateString('en-GB', options);
            return {
                count: (page - 1) * pageSize + index + 1,
                ...room.toObject(),  // Convert Mongoose document to plain JavaScript object
                start_date: formattedStartDate,
                end_date: formattedEndDate
            };
        });

        response.json({
            page,
            pageSize,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            data: dataWithFormattedDates,
        });

    } catch (error) {
        console.error('Error fetching booked rooms:', error);
        return errorResponse(response, 400, error);
    }
});

// GET ROOM RATES
router.get(END_POINT.GET_ROOM_RATE, async (req, res) => {
    console.log(new Date(), '===== GET ROOM RATES =====');
    try {
        const roomPrices = await ROOM_PRICE.find();
        successResponse(res, roomPrices);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET one room price
router.get(END_POINT.ROOM_RATE, getRoomPrice, (req, res) => {
    console.log(new Date(), '===== GET ROOM RATE =====');
    successResponse(res, res.roomPrice);
});

// PUT update one room price
router.put(END_POINT.ROOM_RATE, getRoomPrice, async (req, res) => {
    console.log(new Date(), '===== UPDATE ROOM RATE =====');

    if (req.body.heading != null) {
        res.roomPrice.heading = req.body.heading;
    }
    if (req.body.sub_heading != null) {
        res.roomPrice.sub_heading = req.body.sub_heading;
    }
    if (req.body.rent != null) {
        res.roomPrice.rent = req.body.rent;
    }
    if (req.body.discount != null) {
        res.roomPrice.discount = req.body.discount;
    }
    try {
        const updatedRoomPrice = await res.roomPrice.save();
        successResponse(res, updatedRoomPrice);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// DELETE one room price
router.delete(END_POINT.ROOM_RATE, getRoomPrice, async (req, res) => {
    console.log(new Date(), ' ===== DELETE ROOM RATE =====');
    try {
        console.log('Id: ' + req.body.id)
        await res.roomPrice.deleteOne({_id: req.body.id})
            .then((result) => {
                if (result.deletedCount > 0) {
                    console.log('Rate deleted successfully');
                } else {
                    console.log('Rate not found with the given ID');
                }
            })
            .catch((err) => {
                console.error('Error deleting room:', err);
            });
        successResponse(res, 'Deleted room price')
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

async function getRoomPrice(req, res, next) {
    let roomPrice;
    try {
        roomPrice = await ROOM_PRICE.findById(req.params.id);
        if (roomPrice == null) {
            return res.status(404).json({message: 'Cannot find room price'});
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    res.roomPrice = roomPrice;
    next();
}


function successResponse(res, message) {
    return res.status(200).json({status: true, data: message});
}

function errorResponse(res, statusCode, message) {
    return res.status(statusCode).json({status: false, error: message});
}

module.exports = router;