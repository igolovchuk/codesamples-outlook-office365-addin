'use strict';

/**
* @namespace ExceptionHandler
*/

/**
* The overriden exception handler, gives ability to handle unhandled errors using custom log service.
* @param {Angular.$injector} $injector                                       The Angular injection container.
* @param {Angular.$log} $log                                                 The Angular logging service.
* @returns {Function}                                                        The overriden handler function.
*/
app.factory('$exceptionHandler', ['$injector', '$log', function ($injector, $log) {
    return function (exception, cause) {
        if (cause) {
            exception.message += String.format(Constants.EXCEPTION_HANDLER_CAUSE_TEMPLATE, cause);
        }

        try {
            var logService = $injector.get(Constants.LOGGING_SERVICE_NAME);
            logService.error('$exceptionHandler -> globalException', exception);
        } catch (ex) {
            $log.error(ex);
            $log.error(exception);
        }
    };
}]);