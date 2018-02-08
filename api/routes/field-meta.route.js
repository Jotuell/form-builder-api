
const express = require('express');
const fieldMetaRouter = express.Router(); 

// const VerifyToken = require('../middlewares/VerifyToken');

const FieldMeta = require('../models/field-meta.model');
const fieldMetaController = require('../controllers/field-meta.controller');
const superController = require('../controllers/super.controller');

const superCnt = superController(FieldMeta);

// fieldMetaRouter.use(VerifyToken());

fieldMetaRouter.route('/')
  .get(fieldMetaController.listAllFieldMeta)
  .post(fieldMetaController.createFieldMeta);

fieldMetaRouter.use('/:id', superCnt.findItemById, superCnt.checkOwner);

fieldMetaRouter.route('/:id')
  .get(fieldMetaController.readFieldMeta)
  .put(superCnt.updateItem)
  .patch(superCnt.updateItem)
  .delete(superCnt.deleteItem);

module.exports = fieldMetaRouter;