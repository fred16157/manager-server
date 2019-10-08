var express = require('express');
var Book = require('../models/book');
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

router.delete('/books/delete/:id', function (req, res) {   //책 정보 삭제
    Book.findByIdAndDelete(req.params.id, function (err, resp) {
        if (err) return res.status(500).json({ error: "Database failure " + err });
        res.json({ result: 1 });
        res.status(204).end();
    });
});

router.put('/books/update/:id', function (req, res) {   //책 정보 갱신(도서 대출 기록)
    Book.findById(req.params.id, function(err, book) {
        if (err) return res.status(500).json({ error: err });
        if (!book) return res.status(404).json({error: "Not found"});

        if(req.body.rentalLog) {
            var rentalLog = req.body.rentalLog;
            for(var log in rentalLog)
            book.rentalLog.push({
                rentalAt: rentalLog[log].rentalAt,
                returnAt: rentalLog[log].returnAt,
                userId: rentalLog[log].userId
            });
        }
        book.status = req.body.status;
        book.save(function(err) {
            if(err) return res.status(500).json({error: err});
            res.json({result: 1});
        });
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