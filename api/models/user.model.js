const mongoose = require('mongoose');
require('mongoose-type-email');
const Schema = mongoose.Schema;
  
const User = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true
  },
  suscription: {
    type: String,
    default: 'open',
    enum: ['open', 'basic', 'premium']
  },
  roles: {
    type: Array,
    default: []
  },
  birth_date: Date,
  registration_date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('User', User);