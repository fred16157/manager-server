var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    route: String,
    method: String,
    code: Number
}, {
    timestamps: {createdAt: "timestamp"}
});

module.exports = mongoose.model("log", LogSchema);