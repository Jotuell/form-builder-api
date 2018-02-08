
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldMeta = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'placeholder',
      'required',
      'readonly',
      'options',
      'css-class',
      'validations',
      'conditional',
      'condition',
      'subordination',
      'subordinate',
      'replicate'
    ]
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  field: {
    type: Schema.ObjectId,
    ref: 'Field',
    required: true
  },
  form: {
    type: Schema.ObjectId,
    ref: 'Form',
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
});


module.exports = mongoose.model('FieldMeta', FieldMeta);