
// Intialize express app
const express = require('express');
const app = express();

// Import the required dependencies
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

// Setup middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.AUTH0_JWKS_URI
  }),
  audience: process.env.HOST,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
});

// Require and register routers
const authRouter = require('./api/routes/auth.route');
const fetchRouter = require('./api/routes/fetch.route');
const userRouter = require('./api/routes/user.route');
const formRouter = require('./api/routes/form.route');
const sectionRouter = require('./api/routes/section.route');
const fieldRouter = require('./api/routes/field.route');
const fieldMetaRouter = require('./api/routes/field-meta.route');

// Setup routes
app.get('/api', (req, res) => {
  res.send('Welcome to Form Builder API');
});

app.use(authCheck);

// app.use('/api/auth', authRouter);
// app.use('/api/users', userRouter);
app.use('/api/fetch', fetchRouter);
app.use('/api/forms', formRouter);
app.use('/api/sections', sectionRouter);
app.use('/api/fields', fieldRouter);
app.use('/api/field-meta', fieldMetaRouter);

module.exports = app;