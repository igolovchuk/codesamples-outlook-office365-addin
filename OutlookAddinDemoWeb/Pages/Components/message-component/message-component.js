'use strict';

/**
* @namespace MessageComponent
*/

/**
* The message component.
* @param {Angular.templateUrl} templateUrl               The angular template Url property.
* @param {Angular.bindings} bindings                     The angular bindings porperty.
*/
app.component('messageComponent', {
    templateUrl: 'Components/message-component/message-component.html',
    bindings: { messageType: '<', messageText: '<' }
});