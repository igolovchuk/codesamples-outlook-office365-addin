'use strict';

/**
* @namespace PageController
*/

/**
* Application page controller.
* @param {Scripts.App.Common.Services.navigation-service}         navigationService                      The navigation service.
* @param {Scripts.App.Common.Services.setting-service}            settingService                         The setting service.
* @param {Scripts.App.Common.Services.auth-service}               authService                            The authentication service.
* @param {Scripts.App.Common.Services.log-service}                logService                             The logging service.
* @param {Scripts.App.Common.Services.office-service}             officeService                          The office service.
*/
app.controller('pageController', ['navigationService', 'settingService', 'authService', 'logService', 'officeService', function (navigationService, settingService, authService, logService, officeService) {

    /**
    * @private @type {Angular.$controller} The main context.
    */
    var context = this;

    /**
    * Navigates to the right location depending on available data.
    * @public
    * @param {boolean} isApplicationInsideMailBox               Determines if application loads inside mailbox or not.
    */
    context.navigate = function (isApplicationInsideMailBox) {
        showLoading(true);

        if (isApplicationInsideMailBox) {
            settingService.loadApplicationSettingsAsync()
                .then(function () { 
                        if (tokenData) {
                            navigationService.goToMainScreen();
                        }
                        else {
                            navigationService.goToHostSelection();
                        }
                })
                .catch(function (error) {
                    logService.error('pageCtrl -> navigate', error);
                    showLoading(false);
                    showErrorMessage(Constants.APP_SETTINGS_LOAD_ERROR_MESSAGE);
                });
        }
    };

    /**
    * Shows loading spinner on UI.
    * @private
    * @param {boolean} isEnabled                                                         The filing data model.
    */
    function showLoading(isEnabled) {
        context.showGlobalLoading = isEnabled;
    }

    /**
    * Shows error message on UI.
    * @private
    * @param {string} text                                                                The error text.
    */
    function showErrorMessage(text) {
        context.globalMessage = text;
        context.globalMessageType = MessageType.error;
    }

    /**
    * Navigates after log in.
    * @private 
    * @param {Scripts.App.Common.Data.models.RequestResult} requestResult                  The login request result.
    */
    function onLoginResultReceived(requestResult) {
        showLoading(false);

        if (requestResult && requestResult.isSuccessful) {
           navigationService.goToMainScreen();
        }
        else {
            showErrorMessage(Constants.LOGIN_ERROR);
        }
    }

     /**
     * Run navigation function when application starts (entry point of application).
     */
    context.navigate(officeService.isInsideMailBox);
}]);