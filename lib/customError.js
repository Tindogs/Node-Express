'use strict';

function CustomError (message, status, innerError) {
    // Call to parent constructor
    Error.call(this, message);

    this.message = message;
    // As status and innerError are optional, first I check if status is defined ans if it is a number
    // In that case, I assing the value of status to the property status
    if (status && Number.isInteger(status)) {
        this.status = status;
    }

    // If status is an Error, then (that is, the caller didn't send a status value, only an error)
    // I assing the value of status to the property innerError
    if (status && status instanceof Error) {
        this.innerError = status;
    }

    if (innerError && innerError instanceof Error) {
        this.innerError = innerError;
    }

    // I propagate the status from inner to outter
    if (this.innerError && this.innerError.status) {
        this.status = this.innerError.status;
    }

    // This function returns an output object for the API.
    // Here I translate the mesagges
    this.toPrettyObject = function () {
        let pretty = {};
        pretty.success = false;
        pretty.error = {};
        pretty.error.message = this.message;
        if (this.innerError) {
            pretty.info = getInfo(this.innerError);
        }
        return pretty;
    };
}

// Obtain innerErrors messages.
function getInfo (err) {
    let info = {};
    info.error = {};
    info.error.message = err.message;
    if (err.innerError) {
        info.error.info = getInfo(err.innerError);
    }
    return info;
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;
module.exports = CustomError;
