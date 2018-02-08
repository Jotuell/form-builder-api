
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Section = new Schema({
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


module.exports = mongoose.model('Section', Section);