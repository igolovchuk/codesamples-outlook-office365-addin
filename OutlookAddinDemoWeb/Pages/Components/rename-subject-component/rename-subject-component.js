'use strict';

/**
* @namespace RenameSubjectComponent
*/

/**
* The rename subject component.
* @param {Angular.templateUrl} templateUrl               The angular template Url property.
* @param {Angular.bindings} bindings                     The angular bindings porperty.
*/
app.component('renameSubjectComponent', {
    templateUrl: 'Components/rename-subject-component/rename-subject-component.html',
    bindings: { isOpen: '=', value: '<', validationPattern: '<', onSave: '&' },
    controller: ['$window', function ($window) {
         
        /**
        * @private @type {Angular.$controller} The main context.
        */
        var context = this;

        /**
        * The text change event handler.
        * @public
        */
        context.onTextChange = function () {
            context.value = context.value && context.value.replace(context.validationPattern, Constants.EMPTY_STRING);
        };

        /**
        * The dialog close event handler.
        * @param {boolean} callSave                      If need to call save or cancel.
        * @public
        */
        context.onClose = function (callSave) {
            if (callSave) {
                context.onSave({ subject: context.value });
            }
            else {
                context.value = context.initialValue;
            }
           
            $window.scrollTo(0, 0);
            context.isOpen = false;
        };
    }]
});