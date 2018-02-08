
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Section = require('./section.model');
const Field = require('./field.model');
const FieldMeta = require('./field-meta.model');

const Form = new Schema({
  slug: {
    type: String,
    required: true,
    lowercase: true,
    set: v => v.replace(/\s/g, '-')
  },
  title: {
    type: String,
    required: true
  },
  description: String,
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

module.exports = mongoose.model('Form', Form);