'use strict';

/**
* Application custom exceptions.
*/

/**
* The chain error.
* @constructor
* @param {Scripts.App.Common.Data.enums} chainErrorType                  The chain error type enumeration value.
* @param {Scripts.App.Common.Data.models.RequestResult} requestResult    The failed request result.
* @param {string} message                                                The error message text.
*/
function ChainError(chainErrorType, requestResult, message) {
    message = message || Constants.NO_ERROR_MESSAGE;
    var instance = new Error(message);

    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    Object.defineProperty(instance, 'requestResult', {
        value: requestResult,
        writable: false
    });
    Object.defineProperty(instance, 'chainErrorType', {
        value: chainErrorType,
        writable: false
    });

    return instance;
}

/**
* Setting custom error prototype.
*/
ChainError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

if (Object.setPrototypeOf){
    Object.setPrototypeOf(ChainError, Error);
} else {
    ChainError.__proto__ = Error;
}
/** End of Chain error */
