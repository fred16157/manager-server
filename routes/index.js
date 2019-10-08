var express = require('express');
var router = express.Router();
var Book = require('../models/book');

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

module.exports = router;
