'use strict';

/**
* @namespace TimeService
*/

/**
* The time management service.
* @param {Angular.$timeout} $timeout                                                    The angular timeout service.
* @param {Angular.$q} $q                                                                The angular services which works with promises.
*/
app.service('timeService', ['$timeout', '$q', function ($timeout, $q) {
    /**
    * Delays function execution.
    * @public
    * @param {function()} action                                                        The action to execute.
    * @param {number} delayTime                                                         The delay time.
    * @param {object} cancellationTokenSource                                           The cancellation token source (optional).
    */
    this.delay = function (action, delayTime, cancellationTokenSource) {
        var timer = $timeout(action, delayTime);

        if (cancellationTokenSource) {
            cancellationTokenSource.token = timer;
            cancellationTokenSource.cancelFunction = () => { $timeout.cancel(timer); };
        }
    };

    /**
    * Executes action and if it won't complete until delayTime, then will no wait result.
    * @public
    * @param {function(promise)} action                                                 The action to execute.
    * @param {number} delayTime                                                         The delay time.
    * @param {object} cancellationTokenSource                                           The cancellation token source (optional).
    * @return {promise}                                                                 The resolved promise.
    */
    this.cancelAfter = function (action, delayTime, cancellationTokenSource) {
        var deferred = $q.defer();

        $timeout(function () {
            deferred.resolve();
        }, delayTime);

        if (action && typeof action === Constants.TYPE_FUNCTION && action.length > 0) {
            action(deferred);
        }

        if (cancellationTokenSource) {
            cancellationTokenSource.token = deferred;
            cancellationTokenSource.cancelFunction = () => { deferred.reject(); };
        }

        return deferred.promise;
    };

    /**
    * Throttle execution of some action on predefined period of time.
    * @public
    * @param {function()} action                                                        The action to execute.
    * @param {number} delayTime                                                         The delay time.
    * @return {function()}                                                              The function with closed throttle state.
    */
    this.throttle = function (action, delayTime) {
        var isThrottled = false;

        return function () {
            if (isThrottled) return;

            isThrottled = true;
            action.apply(this, arguments);

            $timeout(function () {
                isThrottled = false;
            }, delayTime);
        };
    };
}]);