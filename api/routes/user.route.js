
const express = require('express');
const userRouter = express.Router(); 

const VerifyToken = require('../middlewares/VerifyToken');

const User = require('../models/user.model');
const userController = require('../controllers/user.controller');
const superController = require('../controllers/super.controller');

const superCnt = superController(User);

userRouter.get('/', VerifyToken('ADMIN'), userController.listAllUsers);

userRouter.use('/:id', superCnt.findItemById);

userRouter.route('/:id')
  .get(VerifyToken('ADMIN'), userController.readUser)
  .put(VerifyToken(), superCnt.updateItem)
  .patch(VerifyToken(), superCnt.updateItem)
  .delete(VerifyToken('ADMIN'), superCnt.deleteItem);

module.exports = userRouter;
