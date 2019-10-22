var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    rentalLog: [{bookId: String, logId: String, isReturned: false}]
});

module.exports = mongoose.model('user', UserSchema);