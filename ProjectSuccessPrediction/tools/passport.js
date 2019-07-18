const {secret} = require('../configure');

const passport = require('passport'),
    Strategy = require('passport-local').Strategy;

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const memberModel = require('../model/member');

passport.use(new Strategy(
    function (username, password, cb) {
        memberModel.getMemberByEmail(username).then(user => {
            if (!user) {
                return cb(null, false);
            }
            if (user.firstName !== password) {
                return cb(null, false);
            }
            return cb(null, user);
        }, error => {
            return cb(error);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    memberModel.getMemberById(id).then(user => {
        cb(null, user);
    }, error => {
        return cb(err);
    });
});

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
    },
    function (jwtPayload, cb) {
        return memberModel.getMemberById(jwtPayload.id).then(user => {
            cb(null, user);
        }, error => {
            return cb(err);
        });
    }
));

module.exports = passport;