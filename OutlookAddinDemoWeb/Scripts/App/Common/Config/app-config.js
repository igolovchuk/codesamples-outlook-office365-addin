'use strict';

/**
* Application configuration.
* @param {Angular.$routeProvider}            $routeProvider                                  The angular route provider.
* @param {Angular.$httpProvider}             $httpProvider                                   The angular HTTP provider.
*/
app.config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        // Configure interceptors.
        $httpProvider.interceptors.push('HttpInterceptor');

        // Configure routes.
        $routeProvider
            .when('/Hosts',
                {
                    templateUrl: 'HostSelector.html',
                    controller: 'hostController',
                    controllerAs: 'hostCtrl'
                })
            .when('/MessageRead',
                {
                    templateUrl: 'MessageRead.html',
                    controller: 'itemController',
                    controllerAs: 'itemCtrl'
                });
   }]);