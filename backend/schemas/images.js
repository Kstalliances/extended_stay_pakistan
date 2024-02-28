const mongoose = require('mongoose');

const images = new mongoose.Schema({
    images: [{room_img_url: String, room_img_public_id: String}],
    attached_bath: String,
});

const room = mongoose.model('esp_rooms', rooms);
module.exports = room;
