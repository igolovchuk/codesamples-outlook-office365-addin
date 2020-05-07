'use strict';

/**
* @namespace PouchDbProvider
*/

/**
* The PouchDb provider.
*  @returns {object}                                                                The factory object.
*/
app.factory('pouchDbProvider', function () {
    /**
    * @private @type {Scripts.Vendor.PouchDB.pouchdb}                               The Pouch database instance.
    */
    var instance = null;

    return {
        /**
        * Gets or creates database with name.
        * @param {string} name                                                      The database name.
        * @return {Scripts.Vendor.PouchDB.pouchdb}                                  The database object.
        */
        getInstance: function (name) {
            if (!instance && name) {
                instance = new PouchDB(name, { revs_limit: 1, auto_compaction: true });
            }

            return instance;
        }
    };
});