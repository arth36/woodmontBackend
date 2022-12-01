const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const sql = require('mssql')
const cookieParser = require('cookie-parser')

// setup express app
const app = express()
const router = require('./app');

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.use(cookieParser())

// initialize routes
app.use(routes)

app.use(router);

// listen for requests
app.listen(process.env.port || 3000, function(){
    console.log('now listening to 3000')
});
