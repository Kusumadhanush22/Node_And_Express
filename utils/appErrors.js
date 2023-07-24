class AppErrors extends Error {
    constructor(statusCode,message) {
        super(message)
        this.statusCode = statusCode
        this.status = statusCode > 400 && statusCode <500 ? 'fail' : 'error'
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

// class AppErrors extends Error {
//     constructor(statuscode, message) {
//         super(message);
//         this.statusCode = statuscode;
//         this.status = statuscode > 400 && statuscode <500 ? 'fail' : 'error';
//         this.isOperational = true;
        
//         Error.captureStackTrace(this, this.constructor)

//     }
// }
module.exports = AppErrors