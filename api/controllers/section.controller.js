
const Section = require('../models/section.model');
const fieldController = require('../controllers/field.controller');

// CREATES A NEW SECTION
exports.createSection = (req, res) => {

  const section = new Section({
    slug: req.body.slug || req.body.title,
    title: req.body.title,
    description: req.body.description,
    form: req.body.form,
    user: req.userId
  });
  
  section.save(err => {
    if(err) {
      if(err.name === 'ValidationError' || err.code === 11000)
        return res.status(400).send(err);
      return res.status(500).send(err);
    }
    res.status(201).send(section);
  });

};

// RETURNS ALL THE SECTIONS IN THE DATABASE
exports.listAllSections = (req, res) => {

  // If user doesn´t have ADMIN roles, return just user's sections
  if(req.userRoles.indexOf('ADMIN') < 0)
    req.query.user = req.userId;

  Section.find(req.query).lean().exec((err, list) => {
    if(err)
      return res.status(500).send(err);
    if(!list.length)
      return res.status(404).send(`Error: No sections found`);
    list.forEach((item) => {
      item.links = {
        self: `http://${req.headers.host}/api/sections/${item._id}`,
        fields: `http://${req.headers.host}/api/fields?section=${item._id}`,
        form: `http://${req.headers.host}/api/forms/${item.form}`,
        user: `http://${req.headers.host}/api/users/${req.userId}`,
      };
    });
    res.json(list);
  });

};

// GETS A SINGLE SECTION FROM THE DATABASE
exports.readSection = (req, res) => {

  const item = req.item.toObject();
  item.links = {
    fields: `http://${req.headers.host}/api/fields?section=${item._id}`,
    form: `http://${req.headers.host}/api/forms/${item.form}`,
    user: `http://${req.headers.host}/api/users/${req.userId}`
  };

  // If parameter 'ext' is present, retrieves section fields
  if(req.query.hasOwnProperty('ext') && req.query.ext !== false) {
    return fieldController.fetchSectionFields(item._id, res, fields => {
      item.fields = fields;
      res.json(item);
    });
  }
  res.json(item);  

};