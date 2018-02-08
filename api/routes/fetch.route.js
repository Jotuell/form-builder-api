
const express = require('express');
const fetchRouter = express.Router(); 

const VerifyToken = require('../middlewares/VerifyToken');

const fetchController = require('../controllers/fetch.controller');

// fetchRouter.use(VerifyToken());

fetchRouter.get('/:id', fetchController.fetchUserData);
  
module.exports = fetchRouter;