
const express = require('express');
const formRouter = express.Router(); 

// const VerifyToken = require('../middlewares/VerifyToken');

const Form = require('../models/form.model');
const formController = require('../controllers/form.controller');
const superController = require('../controllers/super.controller');

const superCnt = superController(Form);

// formRouter.use(VerifyToken());

formRouter.route('/')
  .get(formController.listAllForms)
  .post(formController.checkSlug, formController.createForm);

formRouter.use('/:id', superCnt.findItemById, superCnt.checkOwner);

formRouter.route('/:id')
  .get(formController.readForm)
  .put(superCnt.updateItem)
  .patch(superCnt.updateItem)
  .delete(superCnt.deleteItem);
  
module.exports = formRouter;