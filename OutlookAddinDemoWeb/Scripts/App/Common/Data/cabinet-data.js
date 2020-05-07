'use strict';

/**
* The cabinet response data wrapper.
* @constructor
* @param {Scripts.App.Common.Data.models.RequestResult}     requestResult                              The cabinet request result object.
* @param {string}                                           currentCabinetId                           The current cabinet Id.
*/
var CabinetData = function (requestResult, currentCabinetId) {

    /**
    * @private @type {CabinetData} The main context.
    */
    var context = this;

    /**
    * @property {Array<object>} items                 Gets the cabinet list data.
    */
    Object.defineProperty(context, 'items', {
        value: requestResult && requestResult.isSuccessful && requestResult.response.length > 0 ? requestResult.response
                                                                                                : [{ id: Constants.NO_ID, name: Constants.CABINET_LOAD_ERROR_DROPDOWN }],
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} currentCabinetId              Gets the current cabinet identifier.
    */
    Object.defineProperty(context, 'currentCabinetId', {
        value: currentCabinetId && this.find(currentCabinetId) ? currentCabinetId : context.items[0].id,
        writable: true,
        enumerable: true
    });

    /**
    * @property {object} currentCabinet                Gets the current cabinet.
    */
    Object.defineProperty(context, 'currentCabinet', {
        get: function () {
            return this.find(context.currentCabinetId);
        },
        enumerable: false
    });

    /**
    * @property {boolean} hasCabinets                  Determines if cabinet data has real cabinets.
    */
    Object.defineProperty(context, 'hasCabinets', {
        get: function () {
            return context.currentCabinetId && context.currentCabinetId !== Constants.NO_ID;
        },
        enumerable: false
    });
};

/**
* Finds cabinet in the list.
* @public
* @param {object} id                                                                The cabinet identifier.
* @return {object}                                                                  The cabinet or undefined.
*/
CabinetData.prototype.find = function (id) {
    return this.items.filter(function (x) { return x.id === id; })[0];
};