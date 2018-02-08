const User = require('../models/user.model');
const Form = require('../models/form.model');
const Section = require('../models/section.model');
const Field = require('../models/field.model');
const FieldMeta = require('../models/field-meta.model');

exports.fetchUserData = (req, res) => {

  User.findById(req.params.id, {password: 0}).lean().exec((err, user) => {

    if (err) return res.status(500).send(err);
    if(!user) return res.status(404).send(`Error: User not found (id: ${req.params.id})`);    

    fetchChildren(Form, {user: user._id}, '-user', forms => {
      
      fetchChildren(Section, {user: user._id}, '-user', sections => {
        
        fetchChildren(Field, {user: user._id}, '-user -form -created -updated -__v', fields => {
          
          fetchChildren(FieldMeta, {user: user._id}, '_id name value field', metadata => {

            // embeddMetadata(fields, metadata);

            embeddChildren({parents: fields, parentKey: 'field', children: metadata, childCollection: 'metadata'});

            embeddChildren({parents: sections, parentKey: 'section', children: fields, childCollection: 'fields'});
            
            embeddChildren({parents: forms, parentKey: 'form', children: sections, childCollection: 'section'});
            
            user.forms = forms;
  
            res.json(user);

          })
          
        });

      });

    });

  });

}

function fetchChildren(Model, filter, select, done) {
  Model.find(filter).select(select).lean().exec((err, children) => {
    if (err) return res.status(500).send(err);
    done(children);
  });
}

function embeddChildren (opts) {

  const parents = opts.parents,
        parentKey = opts.parentKey,
        children = opts.children,
        childCollection = opts.childCollection;
  
  children.forEach(child => {
          
    if(!child.hasOwnProperty(parentKey)) return;
    parents.forEach(parent => {
      
      if(child[parentKey].toString() !== parent._id.toString()) return;
      
      if(!parent.hasOwnProperty(childCollection)) parent[childCollection] = [];
    
      parent[childCollection].push(child);
    
    });
    
  });

  return parents;
  
}

function embeddMetadata(fields, metadata) {
  
  metadata.forEach(item => {
          
    fields.forEach(field => {
      
      if(item.field.toString() !== field._id.toString()) return;
      
      if(!field.hasOwnProperty(metadata)) field.metadata = {};
    
      field.metadata[item.name] = item.value;
    
    });
    
  });
  
}