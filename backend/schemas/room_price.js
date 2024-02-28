const mongoose = require('mongoose');

const roomPriceSchema = new mongoose.Schema({
    heading: String,
    sub_heading: String,
    days: String,
    rent: String,
    discount: String,
});

const RoomPrice = mongoose.model('esp_room_price', roomPriceSchema);

// Example data for multiple records
const roomPricesData = [
    {heading: 'Daily', sub_heading: 'One Day', days: '7', rent: '3000', discount: '0'},
    {heading: 'Week', sub_heading: 'More than 1 week less than 1 month', days: '30', rent: '2100', discount: '30'},
    {heading: 'Month', sub_heading: 'Above 1 month less than 3 months', days: '90', rent: '1800', discount: '40'},
    {heading: 'Month+', sub_heading: 'Above 3 month less than 6 months', days: '180', rent: '1500', discount: '50'},
    // Add more records as needed
];

// Save multiple records
// RoomPrice.create(roomPricesData)
//     .then(roomPrices => {
//         console.log('Room prices saved successfully:', roomPrices);
//     })
//     .catch(err => {
//         console.error('Error saving room prices:', err);
//     });
module.exports = RoomPrice;

