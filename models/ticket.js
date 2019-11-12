var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    bookId: String,
    logId: String,
    userId: String,
}, {timestamps: {createdAt: "returnAt"}});

module.exports = mongoose.model("ticket", TicketSchema);