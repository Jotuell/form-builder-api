
const express = require('express');
const sectionRouter = express.Router(); 

// const VerifyToken = require('../middlewares/VerifyToken');

const Section = require('../models/section.model');
const sectionController = require('../controllers/section.controller');
const superController = require('../controllers/super.controller');

const superCnt = superController(Section);

// sectionRouter.use(VerifyToken());

sectionRouter.route('/')
  .get(sectionController.listAllSections)
  .post(sectionController.createSection);

sectionRouter.use('/:id', superCnt.findItemById, superCnt.checkOwner);

sectionRouter.route('/:id')
  .get(sectionController.readSection)
  .put(superCnt.updateItem)
  .patch(superCnt.updateItem)
  .delete(superCnt.deleteItem);
  
module.exports = sectionRouter;