var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    logId: String
});

module.exports = mongoose.model("ticket", TicketSchema);