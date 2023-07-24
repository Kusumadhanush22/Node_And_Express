//IMPORTS Section
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path:'./config.env'})
const app = require('./app')

const dBpassword = process.env.DATABASE_PASSWORD;
const dB = process.env.DATABASE.replace('<PASSWORD>', dBpassword)
console.log(dB)
mongoose.connect(dB).then((con) => {
    console.log("DB Connected Successfully!")
}).catch((err) =>{
    console.log(err)
})

const port = 8000
//Server Code
const server = app.listen(port, () => {
    console.log(`The Server is listening to the Port ${port}`)
})
process.on('unhandledRejection', err => {
    console.log("Un Handled Exception")
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
    
})

process.on('uncaughtException', err => {
    console.log("Un Caught Exceptions");
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
})