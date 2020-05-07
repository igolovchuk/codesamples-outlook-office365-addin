'use strict';

/**
* @namespace SearchService
*/

/**
* The quick search service.
* @param {Scripts.App.Common.Services.http-service} httpService                        The HTTP service.
* @param {Scripts.App.Common.Helpers.url-helper}    urlHelper                          The URL helper.
* @param {Angular.$q}                               $q                                 The Angular promise service.
* @param {Scripts.App.Common.Services.log-service}  logService                         The logging service.
*/
app.service('searchService', ['httpService', 'urlHelper', '$q', 'logService', function (httpService, urlHelper, $q, logService) {
    /**
    * @private @type {Array<number>}                                                   The search configuration cached dictionary.
    */
    var searchConfigurationDictionary = {};

    /**
    * @private @type {Scripts.App.Common.Data.models.CancellationTokenSource} The cancellation token source.
    */
    var cancellationTokenSource = new CancellationTokenSource();

    /**
    * Loads quick search loactions asynchronously.
    * @public @memberof SearchService
    * @param  {string} cabinetId                                                       The cabinet identifier.
    * @param  {string} queryText                                                       The query text.
    * @return {Scripts.App.Common.Data.models.RequestResult}                           The quick search locations request result.
    */
    this.loadQuickSearchLocationsAsync = function (cabinetId, queryText) {
        cancellationTokenSource.cancel();

        var deffered = httpService.newDeffer();
        cancellationTokenSource = new CancellationTokenSource(deffered.promise, deffered.resolve);

        return getQuickSearchLocationsAsync(cabinetId, urlHelper.fixedEncodeURIComponent(queryText), cancellationTokenSource.token)
                                           .then((result) => filterSearchResults(result, cancellationTokenSource.token));
    };

    /**
    * Requests cancellation for pending prediciton call.
    * @public @memberof PredictionService
    */
    this.cancelPendingRequests = function () {
        cancellationTokenSource.cancel();
    };

    /**
    * Makes call for quick search loactions asynchronously.
    * @private
    * @param  {string}           cabinetId                                             The cabinet identifier.
    * @param  {string}           queryText                                             The query text.
    * @param  {Angular.promise}  cancellationToken                                     The cancellation token.
    * @return {Scripts.App.Common.Data.models.RequestResult}                           The quick search locations request result.
    */
    function getQuickSearchLocationsAsync(cabinetId, queryText, cancellationToken) {
        return httpService.getAsync(String.format(Constants.QUICK_SEARCH_URL_TEMPLATE, cabinetId, queryText), cancellationToken);
    }

    /**
    * Filters received search result by type configuration.
    * @private
    * @param {Object} searchRequestResult                                             The search request result.
    * @param {Angular.promise}  cancellationToken                                     The cancellation token.
    * @return {Scripts.App.Common.Data.models.RequestResult}                          The quick search locations request result.
    */
    function filterSearchResults(searchRequestResult, cancellationToken) {

        if (searchRequestResult.isSuccessful) {
            var searchLocations = searchRequestResult.response.filingLocations;

            if (searchLocations.length > 0) {
                var cabinetId = searchLocations[0].location.cabinetId;

                return getSearchConfigurationAsync(cabinetId, cancellationToken)
                                                  .then(function (config) {
                                                        searchRequestResult.response.filingLocations = filterCollection(searchLocations, config);
                                                        return searchRequestResult;
                                                  });
            }
        }

        return searchRequestResult;
    }

    /**
    * Loads quick search configuration asynchronously.
    * @private
    * @param  {string} cabinetId                                                        The cabinet identifier.
    * @param {Angular.promise}  cancellationToken                                       The cancellation token.
    * @return {Scripts.App.Common.Data.models.RequestResult}                            The quick search configuration request result.
    */
    function getSearchConfigurationAsync(cabinetId, cancellationToken) {

        var configuration = searchConfigurationDictionary[cabinetId];

        if (!configuration) {
            return httpService.getAsync(String.format(Constants.QUICK_SEARCH_CONFIG_URL_TEMPLATE, cabinetId), cancellationToken)
                              .then(processConfigurationResponse);
        }
        
        return httpService.fromPromiseResult(PromiseStatus.resolved, configuration);
    }

    /**
    * Parses filter configuration request result into valid format.
    * @private
    * @param {Scripts.App.Common.Data.models.RequestResult} requestResult                 The filter congiguration request result.
    * @return {Array<Scripts.App.Common.Data.enums.LocationType>}                         The not allowed location types list.
    */
    function processConfigurationResponse(requestResult) {

        var excludedTypeList = [];

        if (requestResult.isSuccessful) {
            var configuration = requestResult.response;

            if (configuration.includeFilters === false) {
                excludedTypeList.push(LocationType.filter);
            }

            if (configuration.includeWorkspaces === false) {
                excludedTypeList.push(LocationType.workspace);
            }

            if (configuration.includeFolders === false) {
                excludedTypeList.push(LocationType.folder);
            }

            // Cache the received response into dictionary.
            searchConfigurationDictionary[configuration.cabinetId] = excludedTypeList;
        }

        return excludedTypeList;
    }

    /**
    * Removes locations from list which are not allowed according configuration.
    * @private
    * @param {Array<object>} filingLocations                                                            The filing locations list.
    * @param {Array<Scripts.App.Common.Data.enums.LocationType>} excludedFilingLocationTypeList         The excluded type configuration.
    * @return {Array<object>}                                                                           The filtered filing loations list.
    */
    function filterCollection(filingLocations, excludedFilingLocationTypeList) {
        var filteredLocationList = [];

        for (var i = 0; i < filingLocations.length; i++) {
            var locationItem = filingLocations[i];

            if (excludedFilingLocationTypeList.indexOf(locationItem.location.type) > -1) {
                continue;
            }

            filteredLocationList.push(locationItem);
        }

        return filteredLocationList;
    }
}]);