'use strict';

/**
* @namespace HttpService
*/

/**
* The HTTP service.
* @param {Angular.$http} $http                                                    The angular HTTP service.
* @param {Scripts.App.Common.Services.setting-service} settingService             The setting service.
* @param {Scripts.App.Common.Services.log-service} logService                     The log service.
* @param {Angular.$q} $q                                                          The angular services which works with promises.
*/
app.service('httpService', ['$http', 'settingService', 'logService', '$q', function ($http, settingService, logService, $q) {
    /**
    * @private @type {object} The app settings HTTP configuration.
    */
    var httpConfiguration = null;

    /**
    * @private @type {boolean} Determines if auth request is runnig to disable logging at that time.
    */
    var isAuthRequestInProgress = false;

    /**
    * Makes asynchronous get call.
    * @public @memberof HttpService
    * @param {string} relativeUrl                               The relative URL path.
    * @param {object} cancellationToken                         The cancellation token (optional).
    * @return {Scripts.App.Common.Data.models.RequestResult}    The request result.
    */
    this.getAsync = function (relativeUrl, cancellationToken) {
        return makeRequestAsync(HttpRequestType.get, relativeUrl, null, cancellationToken);
    };

    /**
    * Makes asynchronous post call.
    * @public @memberof HttpService
    * @param {string} relativeUrl                                The relative URL path.
    * @param {object} data                                       The data to pass.
    * @param {object} cancellationToken                          The cancellation token (optional).
    * @return {Scripts.App.Common.Data.models.RequestResult}     The request result.
    */
    this.postAsync = function (relativeUrl, data, cancellationToken) {
        return makeRequestAsync(HttpRequestType.post, relativeUrl, data, cancellationToken);
    };


    /**
    * Makes asynchronous retry HTTP call.
    * @public @memberof HttpService
    * @param {object} config                                       The failed request configuration.
    * @return {Scripts.App.Common.Data.models.RequestResult}       The request result.
    */
    this.makeRetryAsync = function (config) {
        config.headers.Authorization = Constants.BEARER_AUTH_HEADER_NAME + settingService.tokenData.accessToken;
        return $http(config);
    };

    /**
    * Determines if retry allowed for specific URL.
    * @public @memberof HttpService
    * @param {string} url                                The failed request configuration.
    * @return {boolean}                                  True if retry allowed, otherwise - false.
    */
    this.isRetryAllowed = function (url) {
        var result = false;

        if (!httpConfiguration)
            httpConfiguration = settingService.appSettings && settingService.appSettings.httpConfiguration;

        var retryList = httpConfiguration.retryOnErrorEndpoints;

        if (retryList) {
            for (var i = 0; i < retryList.length; i++) {
                result = url.indexOf(retryList[i]) >= 0;

                if (result === true) {
                    break;
                }
            }
        }

        return result;
    };

    /**
    * Wraps response object into Angular deffer and return resolved object with status.
    * @public @memberof HttpService
    * @param {Scripts.App.Common.Data.enums.PromiseStatus}      promiseStatus                   The promise status.
    * @param {object}                                           response                        The response object to pass.
    * @return {Angular.deffered}                                                                The resolved promise with predefined value.
    */
    this.fromPromiseResult = function (promiseStatus, response) {
        switch (promiseStatus) {
            case PromiseStatus.resolved:
                return $q.resolve(response);
            case PromiseStatus.rejected:
                return $q.reject(response);
        }

        return $q.reject(Constants.HTTP_SERVICE_NOT_SUPPORTED_PROMISE_STATUS_ERROR);
    };

    /**
    * Returns new deffered object.
    * @public @memberof HttpService
    * @return {Angular.deffered}                                                                The Angular deffered object.
    */
    this.newDeffer = function () {
        return $q.defer();
    };

   /**
   * Makes asynchronous HTTP call.
   * @private
   * @param {Scripts.App.Common.Data.enums.HttpRequestType} type                                The HTTP method type.
   * @param {object} relativeUrl                                                                The relative URL path.
   * @param {object} data                                                                       The data to pass.
   * @param {object} cancellationToken                                                          The cancellation token (optional).
   * @return {Scripts.App.Common.Data.models.RequestResult}                                     The request result.
   */
    function makeRequestAsync(type, relativeUrl, data, cancellationToken) {
        var tokenData = settingService.tokenData;
        var hostData =  settingService.getHostData(tokenData.hostKey);
        var requestUrl = Constants.HTTPS_SCHEME + hostData.ApiUrl + Constants.API_VERSION_ONE_URL_PATH + relativeUrl;

        var request = { url: requestUrl, method: type, transformResponse: handleResponse };

        if (data) {
            request.data = JSON.stringify(data);
        }

        if (cancellationToken) {
            request.timeout = cancellationToken;
        }

        $http.defaults.headers.common.Authorization = Constants.BEARER_AUTH_HEADER_NAME + tokenData.accessToken;
        $http.defaults.headers.post[Constants.CONTENT_TYPE_HEADER_NAME] = Constants.CONTENT_TYPE_JSON;
       
        return $http(request).then(parseResponse, parseResponse);
    }

    /**
    * Parses server response into request result object.
    * @private 
     *@param {Object} response                                    The server response.
    * @return {Scripts.App.Common.Data.models.RequestResult}      The request result.
    */
    function parseResponse(response) {
        var requestResult = response instanceof RequestResult
                                     ? response
                                     : new RequestResult(response);

        if (requestResult.isCancelled) {
            // Stop promise chain and do nothing.
            return $q(() => null);
        }

        return requestResult;
    }

    /**
    * Handles response from server.
    * @private 
    * @param {Object} data                                The server response data.
    * @param {Object} headersGetter                       The headers getter.
    * @param {Object} status                              The server response status.
    * @return {Object}                                    The response data.
    */
    function handleResponse(data, headersGetter, status) {
        // Workaround to handle server-side non-JSON errors.
        try {
            return JSON.parse(data);
        } catch (ex) {
            logService.error('httpService -> handleResponse', ex);

            return data;
        }
    }
}]);