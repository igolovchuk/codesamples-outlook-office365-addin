'use strict';

/**
* @namespace EditAccessComponent
*/

/**
* The edit access component.
* @param {Angular.templateUrl} templateUrl                  The angular template Url property.
* @param {Angular.bindings}    bindings                     The angular bindings porperty.
*/
app.component('editAccessComponent', {
    templateUrl: 'Components/edit-access-component/edit-access-component.html',
    bindings: { isOpen:'=', value: '<', onSave: '&' },
    controllerAs: 'accessCtrl',
    controller: ['accessService', function (accessService) {

        /**
        * @private @type {Angular.$controller} The main context.
        */
        var context = this;

        /**
        * Initializes access values.
        * @public
        */
        context.initValues = function () {
            context.accessList = angular.copy(context.value || accessService.getDefaultAccessList());
            context.initialAccessList = angular.copy(context.accessList);
        }; 

        /**
        * Checks if there are any checked access options and if current access state is different from last saved.
        * @public
        * @return {boolean} True if access button can be enabled, otherwise - false.
        */
        context.canSaveAccess = function () {
            return context.accessList.some(x => x.Selected === true) && accessService.isAccessChanged(context.initialAccessList, context.accessList);
        };

        /**
        * The save access state event handler.
        * @public
        */
        context.submitAccess = function () {
            context.onSave({ accessList: context.accessList });
            context.isOpen = false;
        };
    }]
});