
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const mongoose = require('mongoose');

const app = require('./app');

const port = process.env.PORT || 3030;

//  Connect to database
mongoose.connect('mongodb://localhost/form-builder', { autoIndex: true }, (err) => {
  if(err) {
    throw err;
  } else {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`API running on port on PORT: ${port}`);
    });
  }
});