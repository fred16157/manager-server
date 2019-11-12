var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.post('/login', function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
        if(err) return res.status(500).json({error: err});
        if(user == null || user.password !== req.body.password) return res.status(404).json({error: "Not found"});
        return res.json({id: user._id});
    });
});

router.get('/info/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if(err) return res.status(500).json({error: err});
        return res.json(user);
    });
});

router.post('/signup', function(req, res, next) {
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

module.exports = router;