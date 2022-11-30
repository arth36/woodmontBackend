const express = require('express')

const Route = express.Router();

Route.use('/app', require('./app/appRoutes'));

module.exports = Route;
