'use strict';

/**
* @namespace OfficeServcie
*/

/**
* The office service.
* @param {Angular.$q}                                       $q                      The angular services which works with promises.
* @param {Office.context}                                   officeContext           The office API context.
* @param {Scripts.App.Common.Providers.restapi-provider}    restApiProvider         The outlook REST API provider.
*/
app.service('officeService', ['$q', 'officeContext', 'restApiProvider', function ($q, officeContext, restApiProvider) {

    /**
    * @property {string} appHost                                                    Gets the application host.
    */
    Object.defineProperty(this, 'appHost', {
        value: officeContext.mailbox && officeContext.mailbox.diagnostics.hostName,
        writable: false
    });

    /**
    * @property {string} platform                                                   Gets the application platform.
    */
    Object.defineProperty(this, 'platform', {
        value: officeContext.platform,
        writable: false
    });

    /**
    * @property {string} outlookUserId                                               Gets the current mailbox user email address.
    */
    Object.defineProperty(this, 'outlookUserId', {
        value: officeContext.mailbox && officeContext.mailbox.userProfile && officeContext.mailbox.userProfile.emailAddress,
        writable: false
    });

    /**
    * @public @property {boolean} isInsideMailBox                                    Determines if application is running inside mailbox or not.
    */
    Object.defineProperty(this, 'isInsideMailBox', {
        get: function () {
            return officeContext.mailbox !== undefined;
        }
    });

    /**
    * @property {string} isMobile                                                    Determines if application is running on mobile host or not.
    */
    Object.defineProperty(this, 'isMobile', {
        value: this.appHost !== OfficeHost.webApp && this.appHost !== OfficeHost.desktop,
        writable: false
    });

    /**
    * @public @property {Office.context.roamingSettings} roamingSettings             Gets office API roaming settings.
    */
    Object.defineProperty(this, 'roamingSettings', {
        get: function () {
            return officeContext.roamingSettings;
        }
    });

    /**
    * @public @property {Office.context.mailbox.item} activeItem                     Gets office API active item.
    */
    Object.defineProperty(this, 'activeItem', {
        get: function () {
            var item = officeContext.mailbox && officeContext.mailbox.item;

            if (item) {
                // Attach Outlook REST API to active item.
                item.RestApi = restApiProvider;
            }

            return item;
        }
    });

    /**
    * @callback ItemChanegd
    * @param {object} eventArgs.
    */
    /**
    * Sets item changed handler for mailbox.
    * @public
    * @param {ItemChanged} onItemChangedHandler                        The item changed handler.
    */
    this.addItemChangedHandlerAsync = function (onItemChangedHandler) {
        officeContext.mailbox.addHandlerAsync(Office.EventType.ItemChanged, onItemChangedHandler);
    };

    /**
    * Removes item changed handler for mailbox.
    * @public
    */
    this.removeItemChangedHandlerAsync = function () {
        officeContext.mailbox.removeHandlerAsync(Office.EventType.ItemChanged);
    };

    /**
    * Determines if item is supported or not.
    * @public
    * @param {string} itemClass                        The item class.
    * @return {boolean}                                If item is supported by add-in.
    */
    this.isSupportedItem = function (itemClass) {
        return itemClass.toUpperCase() !== Constants.OUTLOOK_ITEM_TYPE_POST.toUpperCase();
    };

    /**
    * Sends data to parent window.
    * @public @memberof OfficeService
    * @param {object} data                                                           The data to send.
    */
    this.sendToParent = function (data) {
        if (typeof data !== Constants.TYPE_STRING) {
            data = JSON.stringify(data);
        }

        officeContext.ui.messageParent(data);
    };

    /**
    * Closes addin.
    * @public @memberof OfficeService
    */
    this.closeAddin = function () {
        officeContext.ui.closeContainer();
    };

    /**
    * Shows URL in dialog and handles its result asynchronously.
    * @public @memberof OfficeService
    * @param {string} url                                                            The dialog URL (should be HTTPS and local domain or added to AppDomains section in manifest).
    * @return {Scripts.App.Common.Data.models.DialogResult}                          The dialog result result promise.
    */
    this.showDialogAsync = function (url) {
        var deferred = $q.defer();

        officeContext.ui.displayDialogAsync(url, { height: 40, width: 30, promptBeforeOpen: false }, function (asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                var dialog = asyncResult.value;

                dialog.addEventHandler(Office.EventType.DialogMessageReceived, function (dialogResult) {
                    dialog.close();

                   var result = dialogResult.error ? new DialogResult(DialogResultStatus.error, dialogResult.error)
                                                   : new DialogResult(DialogResultStatus.resultRecieved, dialogResult.message);
                    
                    deferred.resolve(result);
                });

                dialog.addEventHandler(Office.EventType.DialogEventReceived, function (dialogResult) {
                    deferred.resolve(new DialogResult(DialogResultStatus.cancelled, dialogResult.error));
                });
            } else {
                deferred.resolve(new DialogResult(DialogResultStatus.openError, asyncResult.error));
            }
        });

        return deferred.promise;
    };
}]);