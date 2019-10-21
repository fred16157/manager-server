var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    timestamp: Date,
    route: String,
    method: String,
    code: Number
});

module.exports = mongoose.model("log", LogSchema);