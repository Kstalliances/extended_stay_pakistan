const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./mongoDatabase');
const END_POINT = require('./globalContants');
const USER = require("./schemas/user");
const BOOKED_ROOMS = require("./schemas/booked_rooms");
const ACC_DETAIL = require("./schemas/account_detail");
// JWT Secret Key
const secretKey = 'r0omB0ok!';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({status: false, error: 'Unauthorized: Token missing'});
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({status: false, error: 'Unauthorized: Token expired or invalid'});
        }

        req.user = decoded;
        next();
    });
};

// LOGIN API
router.post(END_POINT.LOGIN, async (req, res) => {

    console.log("===== Login request =====");
    const {username, password} = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({error: 'Username and password are required'});
    }

    try {
        // Check if the user exists
        const user = await USER.findOne({
            $or: [
                {name: username.toLowerCase()},
                {email: username.toLowerCase()}
            ]
        });

        if (!user) {
            // User not found
            return res.status(401).json({status: false, data: 'Invalid username or password'});
        }

        const storedHashedPassword = user.password;

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!passwordMatch) {
            // Passwords do not match
            return res.status(401).json({status: false, data: 'Invalid username or password'});
        }

        // Passwords match, generate JWT token
        const {id, role} = user;
        const token = jwt.sign({id, username, role}, secretKey, {expiresIn: '24h'});

        res.status(200).json({status: true, data: {userId: id, username, token, userRole: role}});
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({error: 'Error during login'});
    }
});

// API to create user
router.post(END_POINT.SIGN_UP, async (req, res) => {
    const {username, email, phone, password} = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({status: false, error: 'Username and password are required'});
    }

    // Check if the user already exists
    if (username) {
        const foundUser = await USER.findOne({name: username.toLowerCase()});
        console.log('Found user:', foundUser);
        if (foundUser !== null) {
            return res.status(409).json({status: false, error: 'User already exists'});
        }
    } else if (email) {
        const foundUserByEmail = await USER.findOne({email});
        console.log('Found user:', foundUserByEmail);
        if (foundUserByEmail !== null) {
            return res.status(409).json({status: false, error: 'User already exists'});
        }
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({status: false, error: 'Error creating user'});
        }

        // Insert user into the database
        try {
            const savedPerson = await new USER({
                name: username.toLowerCase(),
                email: email,
                phone: phone,
                password: hashedPassword,
                role: 'NORMAL_USER',
            }).save();
            // console.log('Saved user:', savedPerson);
            console.log('User created successfully');
            res.status(200).json({status: true, data: 'User created successfully'});
        } catch (error) {
            console.error('Error saving person:', error);
        }
    });
});

// FORGOT PASSWORD API
router.put(END_POINT.FORGOT_PASSWORD, async (req, res) => {
    console.log('===== FORGOT PASSWORD REQUEST =====');
    const {name, newPassword, confirmPassword} = req.body;

    console.log(`name: ${name} newPassword: ${newPassword} confirmPassword: ${confirmPassword}`)
    try {

        if (!newPassword || !confirmPassword) {
            return res.status(400).send({status: false, code: 1, error: 'Password is required'});
        } else if (!name) {
            return res.status(400).send({status: false, code: 2, error: 'This is field is required'});
        } else if (newPassword !== confirmPassword) {
            console.log(new Date(), ' Your password does not match');
            return res.status(400).send({
                status: false,
                code: 3,
                error: 'Your newPassword and confirmYourPassword value does not match'
            });
        }

        // Find the user by email or name
        const user = await USER.findOne({
            $or: [
                {email: name.toLowerCase()}, // Check if the email matches
                {name: name.toLowerCase()}   // Check if the name matches (case-insensitive)
            ]
        });

        console.log(new Date(), ' Found user: ', user);
        if (!user) {
            console.log(new Date(), 'User not found');
            return res.status(400).json({status: false, code: 4, error: 'User not found!'})
        }

        const passwordMatch = await bcrypt.compare(newPassword, user.password);
        if (passwordMatch) {
            console.log(new Date(), ' New password matches old password');
            return res.status(400).json({status: false, code: 5, error: 'Change your new password value'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save(); // Save the changes

        console.log(new Date(), ' Password updated successfully');
        res.status(200).send({status: true, data: 'Password updated successfully'});
    } catch (error) {
        console.error(new Date(), ' Error updating password:', error);
        res.status(500).send({status: false, code: 6, error: 'Error updating password'});
    }
});

// GET ALL USER API
router.get(END_POINT.USERS, async (req, res) => {
    // Fetch all users from the database
    console.log('===== GET ALL USERS =====');
    try {
        // Fetch all users with selected fields (id, username, role)
        const users = await USER.find();
        const userCount = await USER.countDocuments();

        // Add count field to each user object
        const usersWithCount = users.map((user, index) => ({
            ...user.toObject(),
            count: index + 1
        }));

        res.status(200).json({status: true, total_users: userCount, data: usersWithCount});
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({error: 'Error fetching users'});
    }
});

// router.get(END_POINT.GET_BOOKED_ROOMS, async (req, res) => {
//
//
//     try {
//         const bookedRooms = await BOOKED_ROOMS.find();
//         res.status(200).json({status: true, bookedRooms});
//     } catch (error) {
//         console.error('Error fetching booked rooms:', error);
//         res.status(500).json({error: 'Internal server error'});
//     }
// });

// GET route for paginated data
router.get(END_POINT.GET_BOOKED_ROOMS, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    try {
        const totalItems = await BOOKED_ROOMS.countDocuments();
        const paginatedData = await BOOKED_ROOMS.find()
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        // Calculate count for each room
        const dataWithCount = paginatedData.map((room, index) => ({
            count: (page - 1) * pageSize + index + 1,
            ...room.toObject(),  // Convert Mongoose document to plain JavaScript object
        }));

        res.json({
            page,
            pageSize,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            data: dataWithCount,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put(END_POINT.APPROVE_PAYMENT, async (req, res) => {

    console.log(new Date(), "===== Approve payment Request =====")
    const {userId, roomId, status, checkInDate, checkOutDate} = req.body;
    console.log(`${userId} ${roomId} ${status} ${checkInDate} ${checkOutDate}`)

    try {
        const updatedBooking = await BOOKED_ROOMS.updateOne(
            {user_id: userId, room_id: roomId, start_date: checkInDate, end_date: checkOutDate},
            {$set: {payment_status: status}}
        );

        if (updatedBooking.nModified === 0) {
            return res.status(404).json({error: 'Record not found'});
        }

        res.status(200).json({success: true, data: 'Payment approved'});
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Define a route to get all account details
router.get(END_POINT.ACC_DETAIL, async (req, res) => {
        try {
            const accountDetails = await ACC_DETAIL.find();
            res.json({status: true, data: accountDetails});
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
)
;

module.exports = router;