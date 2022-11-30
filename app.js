const express = require('express')

const route = express.Router()

route.use('/', require('./routes'));

module.exports = route;
