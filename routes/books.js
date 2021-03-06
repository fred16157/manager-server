var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var router = express.Router();

router.put('/rental/:id', function (req, res, next) {
    Book.findById(req.params.id, function(err, book) {
        if(err) return res.status(500).json({error: err});
        if(book.status === 0) return res.status(500).json({error: "Book not available"});
        book.rentalLog.push({
            rentalAt: req.body.rentalAt,
            returnAt: req.body.returnAt,
            userId: req.body.userId
        });
        User.findById(req.body.userId, function (err, user) {
            if(err) return res.status(500).json({error: err});
           user.rentalLog.push({
                bookId: req.params.id,
                logId: book.rentalLog[book.rentalLog.length - 1]._id,
                isReturned: false
           }); 
        });
        book.status = 0;
        book.save(function (err) {
            if(err) return res.status(500).json({error: err});
        });
    });
    return res.status(200).json({result: 1});
});

router.post('/return/', function (req, res, next) {
    Ticket.exists({bookId: req.body.bookId}, function(err, result) {
        if(err) return res.status(500).json({error: err});
        if(result) return res.status(500).json({error: "Return ticket to book already exists"});
        var ticket = new Ticket();
        ticket.bookId = req.body.bookId;
        ticket.logId = req.body.logId;
        ticket.userId = req.body.userId;
        ticket.returnAt = new Date();
        ticket.save(function (err) {
            if(err) res.json({error: err});
            return res.json({result: 1, ticketId: ticket._id});
        });
    });
});

router.post('/upload/:pw', function (req, res, next) {  //책 정보 등록
    if(req.params.pw !== config.password) return res.status(403);
    var book = new Book();
    book.isbn = req.body.isbn;
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishedAt = req.body.publishedAt;
    book.rentalLog = [];
    book.status = 1;
    book.imageUrl = req.body.imageUrl;
    book.tags = req.body.tags;

    book.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        res.json({ result: 1 });
    });
});

module.exports = router;