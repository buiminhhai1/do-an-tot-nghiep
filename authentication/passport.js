const constant = require('../utils/constant');
const passport = require('passport');
const passportJWT = require("passport-jwt");
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const UserModel = require('../models/user');

const jwt = new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: constant.JWT_SECRET
},
(jwtPayload, cb) => {
  return UserModel.findById(jwtPayload._id)
    .then(user => {
      return cb(null, {
        message: 'get imformation about current user',
        username: user.username});
    })
    .catch(err => {
      return cb(err);
    });
  }
);

const local = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
(username, password, cb) => {
  return UserModel.findOne({ username})
    .then(user => {
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      bcrypt.compare(password, user.password, (err, res) => { // so sánh mật khẩu (pass chưa hash và pash đã hash)
        if (res) { // mat khau dung
          return cb(null, user, { 'message': 'Đăng nhập thành công' });
        }
        return cb(null, false, { message: 'Incorrect username or password.' });
      });
    })
    .catch(err => cb(err));
  }
);

passport.use(jwt);
passport.use(local);