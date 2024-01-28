const mongoose = require('mongoose');

const accountDetailSchema = new mongoose.Schema({
    acc_name: String,
    acc_number: String,
});

const AccountDetail = mongoose.model('esp_acc_detail', accountDetailSchema);

// Example data for multiple records
// const accDetailData = [
//     {acc_name: 'Zunair', acc_number: '0345-5010258'},
//     {acc_name: 'Zuanir', acc_number: '0345-5010258'},
//     // Add more records as needed
// ];

// Save multiple records
// AccountDetail.create(accDetailData)
//     .then(roomPrices => {
//         console.log('Account detail saved successfully:', roomPrices);
//     })
//     .catch(err => {
//         console.error('Error saving account detail:', err);
//     });
module.exports = AccountDetail;

