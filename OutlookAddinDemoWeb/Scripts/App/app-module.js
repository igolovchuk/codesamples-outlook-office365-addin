'use strict';

/**
* Creating AngularJS application module.
*/
var app = angular.module("OutlookAddinDemo", [
    'officeuifabric.core',
    'officeuifabric.components',
    'ngRoute'
]);

/**
* The function that bootstraps angular application.
* @param {string} officeInfo                    Information about host and platform.
*/
function bootstrapAngularApplication(officeInfo) {
    // After the DOM is loaded, add-in-specific code can run.
    angular.element(document).ready(function () {
        // Initialize instance variables to access API objects.
        app.value('officeContext', Office.context);

        angular.bootstrap(document, ['OutlookAddinDemo']);
    });
}

/**
* The initialize function is required for all add-ins.
*/
Office.onReady()
      .then(bootstrapAngularApplication);
