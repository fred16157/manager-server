var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var Log = require('../models/log');
var router = express.Router();

router.get('/search', function (req, res, next) {    //검색
    Book.find(function (err, books) {
        if (err) return res.status(500).send({ error: 'Database failure' });
        res.json(books);
        return;
    });
});

router.get('/status', function(req, res, next) {    //서버 상태
    res.status(200).send({status: 1});
});

router.get('/search/title/:q', function (req, res, next) { //제목으로 검색
    Book.find({ title: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/search/author/:q', function (req, res, next) { //저자로 검색
    Book.find({ author: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/search/isbn/:q', function (req, res, next) {   //isbn으로 검색
    Book.find({ isbn: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/search/tag/:q', function(req, res, next) { //태그로 검색
    Book.find({ tags: { $all: req.params.q.split(",")}}, function(err, books) {
        if(err) return res.status(500).json({error: "Database failure " + err});
        if(books.length === 0) return res.status(404).json({error: "Not found"});
        res.json(books);
    });
});

router.delete('/admin/delete/:pw', function (req, res) {   //책 정보 삭제
    if(req.params.pw !== config.password) return res.status(403);
    Book.findByIdAndDelete(req.body.id, function (err, resp) {
        if (err) return res.status(500).json({ error: "Database failure " + err });
        res.json({ result: 1 });
        res.status(200).end();
    });
});

router.get('/tags', function(req, res, next) {  //사용 가능한 태그 불러오기
    var tags = {};
    tags.list = [];
    Book.find(function(err, books) {
        books.forEach(function(book, i, arr){
            for(var idx in book.tags)
            {
                if(!tags.list.includes(book.tags[idx]))
                {
                    tags.list.push(book.tags[idx]);
                }
            }
        });
        res.json(tags);
    });
});

router.post('/user/login', function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user == null || user.password !== req.body.password) return res.status(404).json({error: "Not found"});
        return res.json({id: user._id});
    });
});

router.get('/user/info/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if(err) return res.status(500).json({error: err});
    });
});

router.get('/admin/log/:pw', function(req, res, next) {
    Log.find(function(err, logs) {
        if(err) return res.status(500).json({error: err});
        return res.json(logs);
    });
});

router.post('/user/signup', function(req, res, next) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.rentalLog = [];
    user.save(function (err) {
        if (err) {
            console.error(err);
            res.json({ error: err });
            return;
        }
        res.json({ result: 1 });
    });
});

router.put('/books/rental/:id', function (req, res, next) {
    Book.findById(req.params.id, function(err, book) {
        if(err || book.status === 0) return res.status(500).json({error: err});
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
    res.status(200).json({result: 1});
});

router.post('/books/return/', function (req, res, next) {
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

router.get('/admin/tickets/:pw', function(req, res, next) {
    if(req.params.pw !== config.password) return res.status(403);
    Ticket.find(function(err, tickets) {
        if(err) res.status(500).json({error: err});
        res.json(tickets);
    });
})

router.post('/admin/ticket/:pw', function (req, res, next) {
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

router.post('/books/restore', function(req, res, next) {
    for(var i in req.body)
    {
        var book = new Book();
        book.isbn = req.body[i].isbn;
        book.title = req.body[i].title;
        book.author = req.body[i].author;
        book.publishedAt = req.body[i].publishedAt;
        book.rentalLog = [];
        book.status = 1;
        book.imageUrl = req.body[i].imageUrl;
        book.tags = req.body[i].tags;
        book.save(function (err) {
            if (err) {
                console.error(err);
                res.json({ error: err });
                return;
            }
            res.json({ result: 1 });
        });
    }
});

router.post('/books/upload', function (req, res, next) {  //책 정보 등록
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