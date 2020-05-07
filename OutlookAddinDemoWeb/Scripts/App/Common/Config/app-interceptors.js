'use strict';

/**
* Application HTTP interceptor.
* @param {Angular.$q} $q                               The angular services which works with promises.
* @param {Angular.$injector} $injector                 The angular services which represents injection container.
* @returns {object}                                    The HTTP interceptor object.
*/
app.factory('HttpInterceptor', ['$q', '$injector', function ($q, $injector) {

    return {
        /**
        * On request success.
        * @param {object} config         Contains the data about the request before it is sent.
        * @return {object}               The config or wrap it in a promise if blank.
        */
        request: function (config) {
            if (config) {
                config.requestTimestamp = new Date().getTime();
            }
            
            return config || $q.when(config);
        },

        /**
        * On request failure.
        * @param {object} rejection       Contains the data about the error on the request.
        * @return {object}                The promise rejection.
        */
        requestError: function (rejection) {
            return $q.reject(rejection);
        },

        /**
        * On response success.
        * @param {object} response        Contains the data from the response.
        * @return {object}                The response or promise.
        */
        response: function (response) {
            if (response && response.config) {
                response.config.responseTimestamp = new Date().getTime();
            }

            return response || $q.when(response);
        },

        /**
        * On response failure.
        * @param {object} rejection       Contains the data about the error.
        * @return {object}                The promise rejection.
        */
        responseError: function (rejection) {
            if (rejection && rejection.config) {
                rejection.config.responseTimestamp = new Date().getTime();
            }
            
            return processError(rejection);
        }
    };

    /**
    * Analyzes and processes rejection.
    * @param {object} rejection       Contains the data about the error.
    * @return {object}                The response object.
    */
    function processError(rejection) {
        if (rejection && rejection.status) {
            switch (rejection.status) {
                case HttpStatusCode.unauthorized:
                    return isLoggingEndpoint(rejection.config.url)
                           ? $q.reject(rejection)
                           : refreshTokenAndResendRequestAsync(rejection.config);
                case HttpStatusCode.internalServerError:
                case HttpStatusCode.notImplemented:
                case HttpStatusCode.badGateway:
                case HttpStatusCode.serviceUnavailable:
                case HttpStatusCode.gatewayTimeout:
                case HttpStatusCode.httpVersionNotSupported:
                    return retryRequest(rejection);
            }
        }

        return $q.reject(rejection);
    }

    /**
    * Tries to refresh token and resend failed with Unauthorized error request.
    * @private
    * @param {object} config                                               Contains the data about the request before it was failed.
    * @return {Scripts.App.Common.Data.models.RequestResult}               The result of retry call.
    */
    function refreshTokenAndResendRequestAsync(config) {
        return $injector.get(Constants.AUTH_SERVICE_NAME).refreshTokenAsync()
                        .then(function (requestResult) {
                              return requestResult.isSuccessful
                                     ? $injector.get(Constants.HTTP_SERVICE_NAME).makeRetryAsync(config)
                                     : requestResult;
            });
    }

    /**
    * Analyzes and processes rejection.
    * @param {object} rejection                                      Contains the data about the error.
    * @return {object}                                               The response object.
    */
    function retryRequest(rejection) {
        var httpService = $injector.get(Constants.HTTP_SERVICE_NAME);

        if (httpService.isRetryAllowed(rejection.config.url)) {
            if (!rejection.config.retryCount) {
                rejection.config.retryCount = 0;
            }

            if (rejection.config.retryCount < Constants.RETRY_COUNT) {
                rejection.config.retryCount++;
                return httpService.makeRetryAsync(rejection.config);
            }
        }

        return $q.reject(rejection);
    }

    /**
    * Determines whether URL is logging endpoint.
    * @param {string} url                                     The URL string.
    * @return {boolean}                                       True if URL is logging endpoint, otherwise - false.
    */
    function isLoggingEndpoint(url) {
        return url && url.indexOf(Constants.LOGGING_URL) >= 0;
    }
}]);