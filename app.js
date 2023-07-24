//IMPORTS SECTION
const express = require('express')
var bodyParser = require('body-parser');
const http = require('http')
const tourRoutes = require('./routes/tours-routes')
const userRoutes = require('./routes/users-routes')
const AppErrors = require('./utils/appErrors')
const errorController = require('./controllers/error-controller')
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
//Routes
app.use('/api/v1/tours',tourRoutes)
app.use('/api/v1/users',userRoutes)

//Error Handling 
app.all('*',(req, res, next) => {
    next(new AppErrors(404, `Can't find the ${req.originalUrl} on this server`));
})
app.use(errorController)
module.exports = app