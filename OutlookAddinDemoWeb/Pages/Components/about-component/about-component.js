'use strict';

/**
* @namespace AboutComponent
*/

/**
* The about component.
* @param {Angular.templateUrl}  templateUrl                  The angular template Url property.
* @param {Angular.bindings}     bindings                     The angular bindings porperty.
* @param {Angular.controllerAs} controllerAs                 The angular controllerAs porperty.
* @param {Angular.controller}   controller                   The angular controller porperty.
*/
app.component('aboutComponent', {
    templateUrl: 'Components/about-component/about-component.html',
    bindings: { isOpen: '=' },
    controllerAs: 'aboutCtrl',
    controller: ['settingService', function (settingService) {

        /**
         * @private @type {Angular.$controller} The main context.
         */
        var context = this;

        /**
         * @public @type {string} The app version before initializing.
         */
        context.appVersion = Constants.EMPTY_STRING;

        /**
         * Initializing values.
         * @public
         */
        context.$onInit = function() {
            context.appVersion = settingService.appSettings.version;
        }
    }]
});