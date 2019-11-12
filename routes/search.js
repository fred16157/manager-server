var express = require('express');
var Book = require('../models/book');
var router = express.Router();

//검색 API 라우트

router.get('/', function (req, res, next) {    //검색
    Book.find(function (err, books) {
        if (err) return res.status(500).send({ error: 'Database failure' });
        res.json(books);
        return;
    });
});

router.get('/title/:q', function (req, res, next) { //제목으로 검색
    Book.find({ title: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/author/:q', function (req, res, next) { //저자로 검색
    Book.find({ author: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/isbn/:q', function (req, res, next) {   //isbn으로 검색
    Book.find({ isbn: { $regex: ".*" + req.params.q + ".*" } }, function (err, books) {
        console.log("검색 요청 수신됨");
        if (err) return res.status(500).json({ error: err });
        if (books.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(books);
    });
});

router.get('/tag/:q', function(req, res, next) { //태그로 검색
    Book.find({ tags: { $all: req.params.q.split(",")}}, function(err, books) {
        if(err) return res.status(500).json({error: "Database failure " + err});
        if(books.length === 0) return res.status(404).json({error: "Not found"});
        res.json(books);
    });
});

module.exports = router;