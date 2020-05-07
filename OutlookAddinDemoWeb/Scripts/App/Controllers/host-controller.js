'use strict';

/**
* @namespace HostController
*/

/**
* Application host controller.
* @param {Scripts.App.Common.Services.navigation-service} navigationService              The navigation service.
* @param {Scripts.App.Common.Config.app-values} hostList                                 The host selection list.
* @param {Scripts.App.Common.Services.setting-service} settingService                    The setting service.
*/
app.controller('hostController', ['navigationService', 'hostList', 'settingService', function (navigationService, hostList, settingService) {

    /**
    * @private @type {Angular.$controller} The main context.
    */
    var context = this;

    /**
    * @public  
    * @type {string}                                The selected host key.
    */
    context.selectedHostKey = settingService.lastSelectedHostKey ? settingService.lastSelectedHostKey : hostList[0].Id;

    /**
    * @public  
    * @type {Array<Scripts.App.Common.Config.app-values>}  The host selection list.
    */
    context.hostList = hostList;

    /**
    * Saves current host and navigates to login page.
    * @public
    * @param {string} hostKey                       The host identifier.
    */
    context.Login = function (hostKey) {
        settingService.lastSelectedHostKey = hostKey;

        navigationService.goToLogin(hostKey);
    };
}]);