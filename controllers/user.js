const UserModel = require('../models/user');
const mongoose = require('mongoose');
const constant = require('../utils/constant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Đăng nhập thất bại',
        user: user
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user.toJSON() , constant.JWT_SECRET , { expiresIn: '15m'});
      return res.json({ user, token });
    });
  })(req, res);
}

exports.register = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username.length === 0 || password.length === 0) {
    return res.json({ message: 'Thông tin người dùng không được để trống'});
  }
  UserModel.findOne({ username: username }, {}, (error, doc) => {
    if (doc) {
      console.log(doc);
      return res.json({message: `username: ${username} đã tồn tại`});
    } else { // Nếu như chưa tồn tại thì sẽ hash mật khẩu.
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          const user = new UserModel({
            _id: new mongoose.Types.ObjectId,
            username: username,
            password: hash
          });
          user.save().then(result => {
            return res.json({
              message: `Đăng kí username: ${username} thành công!`,
              username: username
            });
          }).catch(err => {
            return res.json({
              message: `something wrong!`
            });
          });
        });
      });   
    }
  });
}

exports.getCurrentUser = (req, res, next) => {
  console.log(req);
  res.json(req.user);
}