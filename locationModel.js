const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    customer_id : String,
    start_date : String,
    end_date : String,
    price : String,
    car_id:String,
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;