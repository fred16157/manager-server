var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    timestamp: Date,
    queryString: String,
    queryMethod: String,
    code: Number,
    isError: Boolean
});

module.exports = mongoose.model("log", LogSchema);