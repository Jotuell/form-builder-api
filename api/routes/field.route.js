
const express = require('express');
const fieldRouter = express.Router(); 

// const VerifyToken = require('../middlewares/VerifyToken');

const Field = require('../models/field.model');
const fieldController = require('../controllers/field.controller');
const superController = require('../controllers/super.controller');

const superCnt = superController(Field);

// fieldRouter.use(VerifyToken());

fieldRouter.route('/')
  .get(fieldController.listAllFields)
  .post(fieldController.createField);

fieldRouter.use('/:id', superCnt.findItemById, superCnt.checkOwner);

fieldRouter.route('/:id')
  .get(fieldController.readField)
  .put(superCnt.updateItem)
  .patch(superCnt.updateItem)
  .delete(superCnt.deleteItem);
  
module.exports = fieldRouter;