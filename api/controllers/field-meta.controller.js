
const FieldMeta = require('../models/field-meta.model');

// CREATES A NEW FIELD META
exports.createFieldMeta = (req, res) => {

  const fieldMeta = new FieldMeta({
    name: req.body.name,
    value: req.body.value,
    field: req.body.field,
    form: req.body.form,
    user: req.userId
  });
  
  fieldMeta.save(err => {
    if(err) {
      if(err.name === 'ValidationError' || err.code === 11000)
        return res.status(400).send(err);
      return res.status(500).send(err);
    }
    res.status(201).send(fieldMeta);
  });

};

// RETURNS ALL THE FIELD METAS IN THE DATABASE
exports.listAllFieldMeta = (req, res) => {

  // If user doesn´t have ADMIN roles, return just user's field-meta
  if(req.userRoles.indexOf('ADMIN') < 0)
    req.query.user = req.userId;

  FieldMeta.find(req.query).lean().exec((err, list) => {
    if(err)
      return res.status(500).send(err);
    if(!list.length)
      return res.status(404).send(`Error: No field-meta found`);
    list.forEach((item) => {
      item.links = {
        self: `http://${req.headers.host}/api/field-meta/${item._id}`,
        field: `http://${req.headers.host}/api/fields/${item.field}`,
        user: `http://${req.headers.host}/api/users/${req.userId}`,
      };
    });
    res.json(list);
  });
  
};

// GETS A SINGLE FIELD META FROM THE DATABASE
exports.readFieldMeta = (req, res) => {
  
  const item = req.item.toObject();
  item.links = {
    self: `http://${req.headers.host}/api/field-meta/${item._id}`,
    field: `http://${req.headers.host}/api/fields/${item.field}`,
    user: `http://${req.headers.host}/api/users/${req.userId}`,
  };
  
  res.json(item);

};

exports.fetchFieldMeta = (field, res, done) => {
  
  FieldMeta.find({field}).exec((err, metaList) => {
    if(err)
      return res.status(500).send(err);
    const metadata = {};
    metaList.forEach(meta => {
      metadata[meta.name] = meta.value;
    });
    done(metadata);
  });

};