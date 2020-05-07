'use strict';

/**
* @namespace RestApiProvider
*/

/**
* The Outlook REST API provider.
* @param   {Angular.$q}       $q                                                    The angular services which works with promises.
* @param   {Angular.$http}    $http                                                 The angular HTTP service.
* @param   {Office.context}   officeContext                                         The office API context.
* @returns {object}                                                                 The factory object.
*/
app.factory('restApiProvider', ['$q', '$http', 'officeContext', function ($q, $http, officeContext) {
  
    /**
    * @private @type {Office.context.mailbox}                                       The outlook mailbox object.
    */
    var mailBox = officeContext.mailbox;

    return {
        /**
        * Gets the outlook item internet headers.
        * @param  {string}         itemId                                           The outlook item identifier.
        * @param  {Array<string>}  propertyArray                                    The rest API Propery Array (see https://docs.microsoft.com/en-us/previous-versions/office/office-365-api/api/beta/complex-types-for-mail-contacts-calendar-beta#message)
        * @return {Scripts.App.Common.Data.outlook-item.OutlookItemHeaders}         The outlook item headers or null.
        */
        getItemPropertiesAsync: function (itemId, propertyArray) {

            return getAccessTokenAsync().then(function (restToken) {
                var emptyResult = {};

                if (!restToken)
                    return $q.resolve(emptyResult);
               
                $http.defaults.headers.common.Authorization = Constants.BEARER_AUTH_HEADER_NAME + restToken;
                $http.defaults.headers.post[Constants.CONTENT_TYPE_HEADER_NAME] = Constants.CONTENT_TYPE_JSON;

                return $http.get(String.format(Constants.REST_API_MESSAGE_PROPERTIES_TEMPLATE, getItemRestUrl(), Constants.OUTLOOK_API_VERSION_TWO, getItemRestId(itemId), propertyArray.join(Constants.COMMA_STRING)), { cache: true })
                            .then((response) => response.data || emptyResult, () => emptyResult);
            });
        }
    };

    /**
    * Gets the REST API access token.
    * @return {string}                                                               The the REST API access token or null.
    */
    function getAccessTokenAsync() {
        var deferred = $q.defer();

        mailBox.getCallbackTokenAsync({ isRest: true }, function (asyncResult) {
            deferred.resolve(asyncResult.value);
        });

        return deferred.promise;
    }

    /**
    * Gets identifier valid for REST requests.
    * @param {string} itemId                                                         The outlook item identifier.
    * @return {string}                                                               The well formatted item identifier.
    */
    function getItemRestId(itemId) {
        if (mailBox.diagnostics.hostName === OfficeHost.ios) {
            // ItemId is already REST-formatted.
            return itemId;
        } else {
            // Convert to an item ID for API v2.0.
            return mailBox.convertToRestId(itemId, Office.MailboxEnums.RestVersion.v2_0);
        }
    }

    /**
    * Gets valid REST URL.
    * @param {string} itemId                                                         The outlook item identifier.
    * @return {string}                                                               The well formatted REST Base URL.
    */
    function getItemRestUrl() {
        var isLastCharacterIsSlash = mailBox.restUrl.slice(-1) === Constants.FORWARD_SLASH_STRING; // For iOS it contains slash at the end.

        return isLastCharacterIsSlash ? mailBox.restUrl.replace(Constants.LAST_CHARACTER_REGEX, Constants.EMPTY_STRING)
                                      : mailBox.restUrl;
    }
}]);