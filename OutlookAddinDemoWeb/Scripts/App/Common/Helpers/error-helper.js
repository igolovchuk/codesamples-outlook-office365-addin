'use strict';

/**
* @namespace ErrorHelper
*/

/**
* The error helper, provides error message according type.
* @param {Scripts.App.Common.Common.Congig.app-values} panelErrorList                The panel error list.
* @param {Scripts.App.Common.Common.Congig.app-values} searchErrorList               The search error list.
* @returns {object}                                                                  The error helper object.
*/
app.factory('errorHelper', ['panelErrorList', 'searchErrorList', function (panelErrorList, searchErrorList) {

    return {
        /**
        * Gets the panel error message object according to status code.
        * @public @memberof ErrorHelper
        * @param {number} statusCode                                                The chain error.
        * @return {object}                                                          The response message.
        */
        getPanelMessage: function (statusCode) {
            return getMessage(statusCode, panelErrorList, Constants.PANEL_DEFAULT_ERROR_MESSAGE);
        },

        /**
        * Gets the search error message object according to status code.
        * @public @memberof ErrorHelper
        * @param {number} statusCode                                                The chain error.
        * @return {object}                                                          The response message.
        */
        getSearchMessage: function (statusCode) {
            return getMessage(statusCode, searchErrorList, Constants.SEARCH_DEFAULT_ERROR_MESSAGE);
        }
    };

    /**
    * Get message according to request result and error.
    * @private
    * @param {number} statusCode                                                    The response status code.
    * @param {Array<object>} errorList                                              The error list.
    * @param {string} defaultErrorMessage                                           The default error message.
    * @return {object}                                                              The response message.
    */
    function getMessage(statusCode, errorList, defaultErrorMessage) {
        var messageText = defaultErrorMessage;
        var messageType = statusCode === HttpStatusCode.ok ? MessageType.info : MessageType.error;

        var error = errorList.filter(function (item) { return item.Id === statusCode; })[0];

        if (error) {
            messageText = error.Text;
        }

        return {
            text: messageText,
            type: messageType
        };
    }
}]);