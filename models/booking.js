const { time } = require('console');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    workshopOption: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Booking = mongoose.model('Bookings', bookingSchema);
module.exports = Booking;
