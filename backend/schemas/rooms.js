const mongoose = require('mongoose');

const rooms = new mongoose.Schema({
    room_img_url: String,
    room_img_public_id: String,
    description: String,
    dimensions: String,
    location: String,
    google_map: String,
    contact_name: String,
    contact_no: String,
    user_id: String,
    utility_charges: String,
    additional_person_charges: String,
    charge_per_unit: String,
    wifi: String,
    car_parking: String,
    attached_bath: String,
    meals: String,
    room_service: String,
    washing: String,
    total_rooms: String,
    room_type: String,
});

const room = mongoose.model('esp_rooms', rooms);
module.exports = room;
