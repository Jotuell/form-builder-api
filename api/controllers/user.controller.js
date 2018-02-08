
const User = require('../models/user.model');

// RETURNS ALL THE USERS IN THE DATABASE
exports.listAllUsers = (req, res) => {

  User.find(req.query, { password: 0 }).lean().exec((err, result) => {
    if(err)
      return res.status(500).send(err);
    if(!result.length)
      return res.status(404).send(`Error: No users found`);
    result.forEach((item) => {
      item.links = {
        self: `http://${req.headers.host}/api/users/${item._id}`
      };
    });
    res.json(result);
  });

};

// GETS A SINGLE USER FROM THE DATABASE
exports.readUser = (req, res) => {

  res.json(req.item);

};