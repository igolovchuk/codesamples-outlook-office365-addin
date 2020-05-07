'use strict';

/**
* The abstract location data wrapper, don't use this object directly.
* @constructor
* @param {object} requestResult                              The locations request result object.
*/
var LocationData = function (requestResult) {

    if (this.constructor === LocationData)
        throw new Error('Cannot instanciate abstract class');

    var itemModel = requestResult && requestResult.response ? requestResult.response : { filingLocations: [] };

    /**
    * @property {string} filingLocationListData              Gets the filing location list data (predictiction search Id).
    */
    Object.defineProperty(this, 'filingLocationListData', {
        value: itemModel.filingLocationListData,
        writable: false
    });

    /**
    * @property {Array<object>} filingLocations              Gets the filing locations.
    */
    Object.defineProperty(this, 'filingLocations', {
        value: itemModel.filingLocations,
        writable: false
    });

    /**
    * @property {string} cabinetId                          Gets or sets the cabinet identifier from response.
    */
    Object.defineProperty(this, 'cabinetId', {
        value: requestResult && this.getCabinetIdFromResponse(requestResult.requestUrl),
        writable: true
    });
};

/**
* Generates the panel location display name.
* @public
* @param {object} locationData                              The filing location object.
* @return {string}                                          The location display name.
*/
LocationData.prototype.getLocationDisplayName = function (locationData) {
    var location = locationData.location;
    var displayName = location.name;
    var parentLocation = location.parentLocation;

    if (parentLocation) {
        displayName += String.format(Constants.LOCATION_PARENT_NAME_TEMPLATE, parentLocation.name);
    }

    return displayName;
};

/**
* Generates the panel parent location name.
* @public
* @param {object} locationData                              The filing location object.
* @return {string}                                          The location parent name.
*/
LocationData.prototype.getLocationParentName = function (locationData) {
    var parentName = Constants.EMPTY_STRING;
    var parentLocation = locationData.location && locationData.location.parentLocation;

    if (parentLocation && parentLocation.name) {
        parentName = String.format(Constants.LOCATION_PARENT_NAME_TEMPLATE, parentLocation.name);
    }

    return parentName;
};

/**
* Gets cabinet identifier of locations data belong to.
* @public
* @param {string} requestUrl                                The request URL.
* @return {string}                                          The cabinet identifier or null.
*/
LocationData.prototype.getCabinetIdFromResponse = function (requestUrl) {
    var cabinetId = null;

    if (requestUrl) {
        cabinetId = requestUrl.match(new RegExp('filingLocations/(.*)/'))[1];
    }

    return cabinetId;
};

/**
* Tries to get the identifier for given location.
* @public
* @param {Object} location                                                        The predicted location.
* @return {string}                                                                The location identifier or null.
*/
LocationData.prototype.getLocationIdentifier = function (location) {
    return location && location.envId && location.envId.toUpperCase() || Constants.EMPTY_STRING;
};


/**
* Tries to get the alternative identifier for given location.
* @public
* @param {Object} location                                                        The predicted location.
* @return {string}                                                                The location identifier or null.
*/
LocationData.prototype.getAlternativeLocationIdentifier = function (location) {
    var identifier = Constants.EMPTY_STRING;

    if (location) {
        var attributeArray = [];

        if (location.organizingAttribute) {
            attributeArray.push(location.organizingAttribute);
        }

        if (location.workspaceAttribute) {
            attributeArray.push(location.workspaceAttribute);
        }

        if (location.workspaceParentAttribute) {
            attributeArray.push(location.workspaceParentAttribute);
        }

        if (attributeArray.length > 0) {
            identifier = JSON.stringify(attributeArray);
        }
    }

    return identifier.toUpperCase();
};

