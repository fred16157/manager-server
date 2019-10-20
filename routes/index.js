var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Ticket = require('../models/ticket');
/* GET home page. */
router.get('/', function(req, res, next) {
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

  res.render('index', { title: '책 등록', tags: tags});
    });
});

router.get('/signup/', function(req, res, next) {
    res.render('signup');
});

router.get('/admin/:pw', function(req, res, next) {
    if(req.params.pw !== config.password) return res.status(403);
    Ticket.find(function (err, tickets) {
        if(err) return res.status(500);
        res.render('admin', {tickets: tickets});
    });
});
module.exports = router;
