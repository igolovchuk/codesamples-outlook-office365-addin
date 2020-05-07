'use strict';

/**
* @namespace SpinnerComponent
*/

/**
* The spinner component.
* @param {Angular.templateUrl} templateUrl               The angular template Url property.
* @param {Angular.bindings} bindings                     The angular bindings porperty.
*/
app.component('spinnerComponent', {
    templateUrl: 'Components/spinner-component/spinner-component.html',
    bindings: { loadingText: '@' }
});