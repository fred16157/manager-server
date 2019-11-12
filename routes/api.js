var express = require('express');
var Book = require('../models/book');
var User = require('../models/user');
var Ticket = require('../models/ticket');
var Log = require('../models/log');
var router = express.Router();

router.get('/status', function(req, res, next) {    //서버 상태
    res.status(200).send({status: 1});
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

module.exports = router;