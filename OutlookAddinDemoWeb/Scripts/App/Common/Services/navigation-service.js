'use strict';

/**
* @namespace NavigationService
*/

/**
* The navigation service.
* @param {Angular.$location}                                        $location                              The Angular location service.
* @param {Scripts.App.Common.Services.log-service}                  logService                             The logging service.
* @param {Angular.$window}                                          $window                                The Angular window service.
* @param {Scripts.App.Common.Services.office-service}               officeService                          The office service.
* @param {Scripts.App.Common.Services.auth-service}                 authService                            The auth service.
*/
app.service('navigationService', ['$location', 'logService', '$window', 'officeService', 'authService', function ($location, logService, $window, officeService, authService) {

    /**
    * Navigates to login page.
    * @public @memberof NavigationService
    * @param {string} hostKey               The host key.
    */
    this.goToLogin = function (hostKey) {
        logService.debug('navigationService -> goToLogin');

        var loginURL = authService.getLoginRequestURL(hostKey);

        if (this.isLoginRequiresDialog()) {
            officeService.showDialogAsync(loginURL)
                .then(function (dialogResult) {
                    if (dialogResult.isSuccessful) {
                        $window.location.replace(dialogResult.value);
                    }
                });
        }
        else {
            $window.location.replace(loginURL);
        }
    };

    /**
    * Reloads current view.
    * @public @memberof NavigationService
    */
    this.reload = function () {
        $window.location.reload();
    };

    /**
   * Scrolls to top of the current view.
   * @public @memberof NavigationService
   */
    this.scrollTop = function () {
        $window.scrollTo(0, 0);
    };

    /**
    * Checks if need to call login in dialog view.
    * @public @memberof NavigationService
    * @return {boolean} True if need to call login in dialog view, otherwise - false.
    */
    this.isLoginRequiresDialog = function () {
        var result = false;
        var authConfig = authService.authConfiguration;
        var dialogLoginEnabled = authConfig && authConfig.dialogLoginEnabled;

        if (dialogLoginEnabled) {
            var diaogLoginEnvironments = authConfig.diaogLoginEnvironments;

            result = diaogLoginEnvironments.indexOf(officeService.appHost) >= 0
                || Object.keys(OfficeHost).map(function (e) { return OfficeHost[e]; }).indexOf(officeService.appHost) < 0
                && diaogLoginEnvironments.indexOf(OfficeHost.android) >= 0; // For detecting android.
        }

        return result;
    };

    /**
    * Navigates to host selection page.
    * @public @memberof NavigationService
    */
    this.goToHostSelection = function () {
        logService.debug('navigationService -> goToHostSelection');

        $location.path('/Hosts');
    };

    /**
    * Navigates to main screen page.
    * @public @memberof NavigationService
    */
    this.goToMainScreen = function () {
        logService.debug('navigationService -> goToMainScreen');

        $location.path('/MessageRead');
    };

    /**
    * Checks if URL contains ticket response.
    * @public @memberof NavigationService
    * @return {boolean} True if URL contains ticket response, otherwise - false.
    */
    this.urlContainsTicketResponse = function () {
        return $location.$$absUrl.indexOf(Constants.CODE_PARAMETER) >= 0;
    };

    /**
    * Gets the absolute URL.
    * @public @memberof NavigationService
    * @return {string} The absolute URL.
    */
    this.getCurrentUrl = function () {
        return $location.$$absUrl;
    };
}]);