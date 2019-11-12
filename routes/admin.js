var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var Log = require('../models/log');
var router = express.Router();

router.delete('/delete/:pw', function (req, res) {   //책 정보 삭제
    if(req.params.pw !== config.password) return res.status(403);
    Book.findByIdAndDelete(req.body.id, function (err, resp) {
        if (err) return res.status(500).json({ error: "Database failure " + err });
        res.json({ result: 1 });
        res.status(200).end();
    });
});

router.get('/log/:pw', function(req, res, next) {
    if(req.params.pw !== config.password) return res.status(403);
    Log.find(function(err, logs) {
        if(err) return res.status(500).json({error: err});
        return res.json(logs);
    });
});

router.get('/tickets/:pw', function(req, res, next) {
    if(req.params.pw !== config.password) return res.status(403);
    Ticket.find(function(err, tickets) {
        if(err) res.status(500).json({error: err});
        res.json(tickets);
    });
})

router.post('/ticket/:pw', function (req, res, next) {
    if(req.params.pw !== config.password) return res.status(403);
    Ticket.findByIdAndDelete(req.body.id, function(err, ticket) {
        if(err) return res.status(500).json({error: err});
        if(req.body.isAccepted)
        {
            Book.findById(ticket.bookId, function(err, book){
                if(err) return res.status(500).json({error: err});
                book.status = 1;
                book.save(function(err) {
                    if(err) return res.status(500).json({error: err});
                });
            });
            User.findById(ticket.userId, function (err, user) {
                if(err) return res.status(500).json({error: err});
                for(var i in user.rentalLog)
                {
                    if(user.rentalLog[i].logId = ticket.logId)
                    {
                        user.rentalLog[i].isReturned = true;
                    }
                    user.save(function (err) {
                        if(err) return res.status(500).json({error: err});
                    });
                }
            });
        }
        return res.json({result: 1});
    });
});

module.exports = router;