'use strict';

/**
* @namespace AccessService
*/

/**
* The access service.
* @param {Scripts.App.Common.Config.app-values.fileAccessList}      fileAccessList                 The file access list.
*/
app.service('accessService', ['fileAccessList', function (fileAccessList) {

    /**
    * @private @type {string} The file access list state.
    */
    var lastSavedFileAccessListState = JSON.stringify(fileAccessList);

    /**
    * Returns the default access list values.
    * @public
    * @return {Scripts.App.Common.Config.app-values.fileAccessList}                                 The file access list.
    */
    this.getDefaultAccessList = function () {
        return JSON.parse(JSON.stringify(fileAccessList)); // Trick to do deep clone of array.
    };

    /**
    * Saves the access list state.
    * @public
    * @param {Scripts.App.Common.Config.app-values.fileAccessList} accessList                       The file access list.
    */
    this.saveAccessState = function (accessList) {
        lastSavedFileAccessListState = JSON.stringify(accessList);
    };

    /**
    * Compares current state with the new state or last saved state if new state is not provided.
    * @public
    * @param {Scripts.App.Common.Config.app-values.fileAccessList} value                            The file access list.
    * @param {Scripts.App.Common.Config.app-values.fileAccessList} newValue                         The file access list.
    * @return {boolean}                                                                             True if access is changed, otherwise - false.
    */
    this.isAccessChanged = function (value, newValue) {
        return newValue ? JSON.stringify(value) !== JSON.stringify(newValue)
                        : lastSavedFileAccessListState !== JSON.stringify(value);
    };

    /**
    * Gets the last saved access list state.
    * @public
    * @return {Scripts.App.Common.Config.app-values.fileAccessList}                                 The file access list.
    */
    this.getLastSavedAccessState = function () {
        return JSON.parse(lastSavedFileAccessListState);
    };

    /**
    * Resets the last saved access list state to default.
    * @public
    */
    this.resetAccessState = function () {
        lastSavedFileAccessListState = JSON.stringify(fileAccessList);
    };
}]);