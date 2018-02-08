
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

// CREATES A NEW USER
exports.registerUser = (req, res) => {
  
  if (!req.body.password)
    return res.status(400).send(authResponse(null, 'You must enter a password'));

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  },
  (err, user) => {
    if (err)
      return res.status(500).send(authResponse(null, err.message || err.errmsg));

    // create a token
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send(authResponse(token, 'Registration successful'));
  }); 
};

// CHECKS IF USER EXISTS AND RETURNS A JW TOKEN
exports.loginUser = (req, res) => {
  
  User.findOne().or([{ email: req.body.user }, { name: req.body.user }]).exec((err, user) => {    
    if (err)
      return res.status(500).send(authResponse(null, err.message || err.errmsg));
    if (!user)
      return res.status(404).send(authResponse(null, 'User not found'));
    
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    
    if (!passwordIsValid)
      return res.status(401).send(authResponse(null, 'Wrong password'));
    
    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
    
    res.status(200).send(authResponse(token, 'Log in successful'));
  });
};

// RETURNS THE USER CORRESPONDING TO THE GIVEN JW TOKEN
exports.readMe = (req, res) => {

  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (err)
      return res.status(500).send("There was a problem finding the user.");
    if (!user)
      return res.status(404).send("User not found.");
    
    res.status(200).send(user);
  });

};

function authResponse(token, msg) {
  return {
    auth: !!token,
    token: token,
    message: msg
  };
}