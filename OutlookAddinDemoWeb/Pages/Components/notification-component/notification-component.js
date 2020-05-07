'use strict';

/**
* @namespace NotificationComponent
*/

/**
* The notification component.
* @param {Angular.templateUrl} templateUrl               The angular template Url property.
* @param {Angular.bindings} bindings                     The angular bindings porperty.
*/
app.component('notificationComponent', {
    templateUrl: 'Components/notification-component/notification-component.html',
    bindings: { isOpen: '=', type: '<', text: '<', subText: '<', icon: '<', closeIcon: '<', action: '<' },
    controller: function () {

        /**
        * @private @type {Angular.$controller} The main context.
        */
        var context = this;

        /**
        * The initialization of subtext.
        * @public
        * @param {string}    subText                      The subtext for notification.
        */
        context.initSubText = function (subText) {

            var actionMatch = subText.match(new RegExp('<action>(.*)</action>'));

            if (actionMatch) {
                var splittedText = subText.split(actionMatch[0]);

                context.actionText = actionMatch[1];
                context.subTextPartOne = splittedText[0];
                context.subTextPartTwo = splittedText[1];
            }
            else {
                context.subTextPartOne = subText;
            }
        };
    }
});