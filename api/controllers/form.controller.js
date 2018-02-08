
const Form = require('../models/form.model');
const Section = require('../models/section.model');
const Field = require('../models/field.model');
const FieldMeta = require('../models/field-meta.model');

// CREATES A NEW FORM
exports.createForm = (req, res) => {

  const form = new Form({
    slug: req.formSlug,
    title: req.body.title,
    description: req.body.description,
    user: req.userId
  });
  
  form.save(err => {
    if(err) {
      if(err.name === 'ValidationError' || err.code === 11000)
        return res.status(400).send(err);
      return res.status(500).send(err);
    }
    res.status(201).send(form);
  });

};

// RETURNS ALL THE FORMS IN THE DATABASE
exports.listAllForms = (req, res) => {

  // If user doesn´t have ADMIN roles, return just user's form
  // if(req.userRoles.indexOf('ADMIN') < 0)
  //   req.query.user = req.userId;
  
  Form.find(req.query).lean().exec((err, result) => {
    if(err)
      return res.status(500).send(err);
    if(!result.length)
      return res.status(404).send(`Error: No forms found`);
    result.forEach((item) => {
      item.links = {
        self: `http://${req.headers.host}/api/forms/${item._id}`,
        sections: `http://${req.headers.host}/api/sections?form=${item._id}`,
        fields: `http://${req.headers.host}/api/fields?form=${item._id}`,
        user: `http://${req.headers.host}/api/users/${req.userId}`,
      };
    });
    res.json(result);
  });

};

// GETS A SINGLE FORM FROM THE DATABASE
exports.readForm = (req, res) => {

  const item = req.item.toObject();
  item.links = {
    sections: `http://${req.headers.host}/api/sections?form=${item._id}`,
    fields: `http://${req.headers.host}/api/fields?form=${item._id}`,
    user: `http://${req.headers.host}/api/users/${req.userId}`,
  };
  res.json(item);

};

// CHECKS IF USER HAS A FORM WITH GIVEN SLUG
exports.checkSlug = (req, res, next) => {

  const slug = req.body.slug || req.body.title;
  req.formSlug = slug.toLowerCase().replace(/\s/g, '-');

  const iterateSlugs = function() {
    Form.count({slug: req.formSlug, user: req.userId}, (err, count) => {
      if(err)
        return res.satus(500).send(err);
      if(count) {
        req.formSlug += '-' + Math.floor(Math.random() * 100);
        return iterateSlugs();
      }
      next();
    });
  };
  iterateSlugs();

};

exports.fetchForm = (req, res) => {
  
  const form = req.item.toObject();
  
  Section.find({form: form._id}).exec((err, sections) => {
    if (err) return res.status(500).send(err);
    form.sections = sections;
    Field.find({form: form._id}).lean().exec((err, fields) => {
      if (err) return res.status(500).send(err);
      form.fields = fields;
      res.json(form);
    });
 
  });

}