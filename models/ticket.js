var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    bookId: String,
    logId: String,
    userId: String,
    returnAt: Date
});

module.exports = mongoose.model("ticket", TicketSchema);