const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    description: String,
    alignment: String,
});

const about = mongoose.model('esp_about', aboutSchema);
module.exports = about;

