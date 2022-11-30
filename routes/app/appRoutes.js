const express = require('express');
const appController = require('../../Controllers/app/appController');
const appRouter = express.Router();
const authMiddleware = require('../../helper/auth');

appRouter.post('/signin', appController.signin);

appRouter.post('/scanningProcess', appController.scanningProcess);

appRouter.post('/getSpinnerZones', appController.getSpinnerZones);

appRouter.post('/getTypeVal', appController.getTypeVal);

appRouter.post('/insertScannedValue', appController.insertScannedValue);

module.exports = appRouter
