
const Field = require('../models/field.model');
const fieldMetaController = require('../controllers/field-meta.controller');

// CREATES A NEW FIELD
exports.createField = (req, res) => {

  const field = new Field({
    slug: req.body.slug || req.body.label,
    label: req.body.label,
    type: req.body.type,
    section: req.body.section,
    form: req.body.form,
    user: req.userId
  });
  
  field.save(err => {
    if(err) {
      if(err.name === 'ValidationError' || err.code === 11000)
        return res.status(400).send(err);
      return res.status(500).send(err);
    }
    res.status(201).send(field);
  });

};

// RETURNS ALL THE FIELDS IN THE DATABASE
exports.listAllFields = (req, res) => {

  // If user doesn´t have ADMIN roles, return just user's fields
  if(req.userRoles.indexOf('ADMIN') < 0)
    req.query.user = req.userId;

  Field.find(req.query).lean().exec((err, list) => {
    if(err)
      return res.status(500).send(err);
    if(!list.length)
      return res.status(404).send(`Error: No fields found`);
    list.forEach(item => {
      item.links = {
        self: `http://${req.headers.host}/api/fields/${item._id}`,
        form: `http://${req.headers.host}/api/forms/${item.form}`,
        user: `http://${req.headers.host}/api/users/${req.userId}`,
      };
      if(item.section)
        item.links.section = `http://${req.headers.host}/api/sections/${item.section}`;
    });
    res.json(list);
  });

};

// GETS A SINGLE FIELD FROM THE DATABASE
exports.readField = (req, res) => {

  const item = req.item.toObject();
  item.links = {
    form: `http://${req.headers.host}/api/forms/${item.form}`,
    user: `http://${req.headers.host}/api/users/${req.userId}`
  };
  if(item.section)
    item.links.section = `http://${req.headers.host}/api/sections/${item.section}`;

  // If parameter 'ext' is present, retrieves field metadata
  if(req.query.hasOwnProperty('ext') && req.query.ext !== false) {
    return fieldMetaController.fetchFieldMeta(item._id, res, metadata => {
      item.metadata = metadata;
      res.json(item);
    });
  }
  res.json(item);

};

exports.fetchSectionFields = (section, res, done) => {
  
  Field.find({section}).exec((err, fields) => {
    if(err)
      return res.status(500).send(err);
    fields.forEach(field => {
      fieldMetaController.fetchFieldMeta(field._id, res, metadata => {
        field.metadata = metadata;
      });
    })
    done(fields);
  });

}
