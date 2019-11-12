var express = require('express');
var router = express.Router();
var Book = require('../models/book');
var Ticket = require('../models/ticket');
var Log = require('../models/log');
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
    if(req.params.pw !== config.password) return res.status(403).send('Forbidden');
    Ticket.find(function (err, tickets) {
        if(err) return res.status(500).json({error: err});
        Log.find(function (err, logs) {
            logs = logs.sort(function (a, b) {
                return b.timestamp - a.timestamp; 
            });
            if(err) return res.status(500).json({error: err});
            var codedata = [0,0,0,0,0];
            var methoddata = [0,0,0,0];
            for(var i in logs) {
                codedata[Math.floor(logs[i].code / 100 - 1)]++;
                switch(logs[i].method) 
                {
                    case "GET":
                        methoddata[0]++;
                        break;
                    case "POST":
                        methoddata[1]++;
                        break;
                    case "PUT":
                        methoddata[2]++;
                        break;
                    case "DELETE":
                        methoddata[3]++;
                        break;
                }
            }
            var moment = require('moment');
            res.render('admin', {tickets: tickets, _codedata: codedata, _methoddata: methoddata, log: logs, pw: config.password, moment: moment});
        });
    });
});
module.exports = router;
