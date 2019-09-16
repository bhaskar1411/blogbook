const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");

exports.signUp = (req, res, next) =>{
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({
        message: "User registered succesfully"
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Email exist or check your internet connection!!"
      });
    });
  });
}

exports.logIn = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const token  = jwt.sign(
      {name: fetchedUser.name, userId: fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Auth failed"
    });
  });
}
