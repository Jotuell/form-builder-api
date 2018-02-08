
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Field = new Schema({
  slug: {
    type: String,
    required: true,
    lowercase: true,
    set: v => v.replace(/\s/g, '-')
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
     enum: [
      'text',
      'textarea',
      'number',
      'select',
      'checkbox',
      'radio',
      'date',
      'date-range',
      'birth-date',
      'range',
      'phone',
      'email',
      'color',
      'google-place'
    ]
  },
  section: {
    type: Schema.ObjectId,
    ref: 'Section',
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


module.exports = mongoose.model('Field', Field);