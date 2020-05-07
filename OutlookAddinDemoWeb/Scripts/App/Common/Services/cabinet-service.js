'use strict';

/**
* @namespace CabinetService
*/

/**
* The cabinet service.
* @param {Scripts.App.Common.Services.http-service}        httpService                  The HTTP service.
* @param {Scripts.App.Common.Services.setting-service}     settingService               The setting service.
* @param {Scripts.App.Common.Services.log-service}         logService                   The logging service.
* @param {Scripts.App.Common.Helpers.security-helper}      securityHelper               The security helper.
* @param {Scripts.App.Common.Services.storage-service}     storageService               The storage service.
*/
app.service('cabinetService', ['httpService', 'settingService', 'logService', 'securityHelper', 'storageService', function (httpService, settingService, logService, securityHelper, storageService) {
    /**
    * @private @type {Array<object>} The active item cached cabinet list.
    */
    var currentCabinetList = null;

    /**
    * @private @type {object} The app settings caching configuration.
    */
    var cachingConfig = settingService.appSettings.cachingConfiguration;

    /**
    * @private @type {object} The app settings filing configuration.
    */
    var filingConfig = settingService.appSettings.filingConfiguration;
     
    /**
    * Loads cabinets asynchronously.
    * @public @memberof CabinetService
    * @return {Scripts.App.Common.Data.models.RequestResult}        The cabinet request result.
    */
    this.loadCabinetsAsync = function () {
        if (!cachingConfig.cabinetCachingEnabled)
            return httpService.getAsync(Constants.USER_CABINETS_URL)
                              .then(parseCabinetResponse);

        return storageService.getItem(StorageType.database, Constants.CABINET_CACHE_KEY)
                             .then(function (cacheItem) {
                                        if (cacheItem && new Date(cacheItem.creationDate).addDays(1) > new Date()) {
                                            currentCabinetList = cacheItem.value.response;
                                            return cacheItem.value;
                                        }
                                        else {
                                            return httpService.getAsync(Constants.USER_CABINETS_URL)
                                                              .then(parseCabinetResponse);
                                        }
                             });
    };

    /**
    * Gets user default cabinet identifier if it exists in current cabinet list.
    * @public @memberof CabinetService
    * @return {Scripts.App.Common.Data.models.RequestResult}        The cabinet request result.
    */
    this.getCurrentCabinetId = function () {
        var defaultCabinetId = settingService.defaultCabinetId;

        var isUserDefaultCabinetExistsInCurrentList = currentCabinetList && currentCabinetList.filter(function (x) { return x.id === defaultCabinetId; }).length > 0;

        return isUserDefaultCabinetExistsInCurrentList ? defaultCabinetId : null;
    };

    /**
    * Saves default cabinet identifier asynchronously.
    * @public @memberof CabinetService
    * @param {string} cabinetId                                      The user default cabinet identifier.
    */
    this.setUserDefaultCabinetIdAsync = function (cabinetId) {
        settingService.defaultCabinetId = cabinetId;
        settingService.saveAsync().then(function (asyncResult) {
            logService.debug('cabinetService -> setUserDefaultCabinetIdAsync', asyncResult);
        });
    };

    /**
    * Clears the cabinet cache data.
    * @public @memberof CabinetService
    */
    this.clearCache = function () {
        if (cachingConfig.cabinetCachingEnabled) {
            storageService.removeItem(StorageType.database, Constants.CABINET_CACHE_KEY);
        }
    };

    /**
    * Parses cabinet server request result into valid format.
    * @private 
     *@param {Object} requestResult                                  The cabinet request result.
    * @return {Scripts.App.Common.Data.models.RequestResult}         The cabinet request result.
    */
    function parseCabinetResponse(requestResult) {

        if (requestResult.isSuccessful) {

            // Get repositories data.
            var repositories = requestResult.response.repositories;

            if (repositories)
            {
                var cabinetList = [];
                for (var i = 0; i < repositories.length; i++) {

                    // Get cabinets for each repository.
                    var cabinets = repositories[i].cabinets;

                    if (cabinets) {
                        for (var j = 0; j < cabinets.length; j++) {

                            // Add cabinet to list.
                            cabinetList.push({
                                id: cabinets[j].cabinetId,
                                name: cabinets[j].cabinetName,
                                isDefault: cabinets[j].defaultCabinet,
                                containsWorkspaces: cabinets[j].containsWorkspaces,
                                repositoryId: repositories[i].repositoryId,
                                hashId: filingConfig.setIndicator ? securityHelper.getHashedString(HashMethod.sha512, cabinets[j].cabinetId.toUpperCase()) : null
                            });
                        }
                    }
                }

                currentCabinetList = cabinetList.sort(function (a, b) { return b.isDefault - a.isDefault || a.name.localeCompare(b.name); });
                requestResult.response = currentCabinetList;

                if (cachingConfig.cabinetCachingEnabled && currentCabinetList.length > 0) {
                    storageService.setItem(StorageType.database, Constants.CABINET_CACHE_KEY, requestResult);
                }
            }
        }

        return requestResult;
    } 
}]);