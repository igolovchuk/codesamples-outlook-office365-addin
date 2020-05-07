'use strict';

/**
* @namespace PredictionService
*/

/**
* The prediction service.
* @param {Scripts.App.Common.Services.http-service} httpService                       The HTTP service.
*/
app.service('predictionService', ['httpService', function (httpService) {
    /**
    * @private @type {Scripts.App.Common.Data.models.CancellationTokenSource} The cancellation token source.
    */
    var cancellationTokenSource = new CancellationTokenSource();

    /**
    * Loads predictions asynchronously.
    * @public @memberof PredictionService
    * @param {Scripts.App.Common.Data.models.PredictionRequest} predictionRequest     The prediction request model.
    * @return {Scripts.App.Common.Data.models.RequestResult}                          The prediction request result.
    */
    this.loadPredictionsAsync = function (predictionRequest) {
        cancellationTokenSource.cancel();

        var deffered = httpService.newDeffer();
        cancellationTokenSource = new CancellationTokenSource(deffered.promise, deffered.resolve);

        return httpService.postAsync(String.format(Constants.PREDICTIVE_SEARCH_URL_TEMPLATE, predictionRequest.cabinetId), predictionRequest.digest, cancellationTokenSource.token)
                          .then(parsePredictionResponse);
    };

    /**
    * Requests cancellation for pending prediciton call.
    * @public @memberof PredictionService
    */
    this.cancelPendingRequests = function () {
        cancellationTokenSource.cancel();
    };

    /**
    * Parses prediction server request result into valid format.
    * @private 
    * @param {Object} requestResult                                                  The prediction request result.
    * @return {Scripts.App.Common.Data.models.RequestResult}                         The prediction request result.
    */
    function parsePredictionResponse(requestResult) {
        if (requestResult.isSuccessful) {
            // Get filing locations data.
            var filingLocations = requestResult.response.filingLocations;

            if (filingLocations) {
                // Sort all itemsby document exists and relevance.
                var sortedLocations = filingLocations.sort(function (a, b) { return a.documentExists === b.documentExists ? b.relevance - a.relevance : a.documentExists ? -1 : 1; });

                requestResult.response.filingLocations = sortedLocations;
            }
        }

        return requestResult;
    }
}]);