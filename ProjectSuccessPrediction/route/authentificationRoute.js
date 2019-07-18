const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('../tools/passport');
const {secret} = require('../configure');

router.post('/login', passport.authenticate('local', {failureRedirect: '/fail'}),
    function (req, res) {
        const user = JSON.parse(JSON.stringify(req.user));
        req.login(user, {session: false}, (err) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            const token = jwt.sign(user, secret);
            return res.jsonp({user, token});
        });
    });

router.get('/logout',
    function (req, res) {
        req.logout();
        res.jsonp({success: true});
    });

router.get('/fail', function (req, res) {
    res.jsonp({authentification: false});
});

router.get('/roles', function (req, res) {
    const {roles} = require('../configure');
    res.jsonp(roles);
});

module.exports = router;