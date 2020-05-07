'use strict';

/**
* @namespace Models Contains not complex objects that have only properties.
*/

/**
 * The request result wrapper.
 * @constructor
 * @param {Angular.http-response} response                                            The HTTP response from server.
 */
function RequestResult(response) {

    /**
    * @property {number} statusCode Gets the request result status code.
    */
    Object.defineProperty(this, 'statusCode', {
        value: response.status,
        writable: false,
        enumerable: true
    });

    /**
    * @property {boolean} isSuccessful Determines whether the request result is successful or not.
    */
    Object.defineProperty(this, 'isSuccessful', {
        value: response.status >= HttpStatusCode.ok && response.status < HttpStatusCode.multipleChoices && response.data ? true : false,
        writable: false,
        enumerable: true
    });

    /**
    * @property {boolean} isCancelled Determines whether the request result is cancelled or not.
    */
    Object.defineProperty(this, 'isCancelled', {
        value: response.xhrStatus && response.xhrStatus === XhrStatus.abort ? true : false,
        writable: false,
        enumerable: true
    });

    /**
    * @property {Object} response Gets the request result response.
    */
    Object.defineProperty(this, 'response', {
        value: response.data,
        writable: true,
        enumerable: true
    });

    /**
   * @property {Scripts.App.Common.Data.enums.RequestResultStatus} requestResultStatus Gets or sets the custom request result status.
   */
    Object.defineProperty(this, 'requestResultStatus', {
        value: this.isSuccessful ? RequestResultStatus.success : RequestResultStatus.error,
        writable: true,
        enumerable: true
    });

    /**
    * @property {string} requestUrl Gets the request URL from response.
    */
    Object.defineProperty(this, 'requestUrl', {
        value: response.config.url,
        writable: false,
        enumerable: true
    });

    /**
    * @property {number} executionTime Gets the request executioin time in seconds.
    */
    Object.defineProperty(this, 'executionTime', {
        value: (response.config.responseTimestamp - response.config.requestTimestamp)/1000,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} creationDate                                   Gets the current object creation date.
    */
    Object.defineProperty(this, 'creationDate', {
        value: new Date().toISOString(),
        writable: false,
        enumerable: true
    });
}

/**
 * The prediction request wrapper.
 * @constructor
 * @param {string} cabinetId                                                 The cabinet identifier.
 * @param {Scripts.App.Common.Data.models.OutlookItem} digest                The digest of enumerable properties of OutlookItem object.
 */
function PredictionRequest(cabinetId, digest) {

    /**
    * @property {string} cabinetId Gets the cabinet identifier.
    */
    Object.defineProperty(this, 'cabinetId', {
        value: cabinetId,
        writable: false
    });

    /**
    * @property {Scripts.App.Common.Data.models.OutlookItem} digest           Gets the digest of enumerable properties of OutlookItem object.
    */
    Object.defineProperty(this, 'digest', {
        value: digest,
        writable: false
    });
}

/**
 * The office dialog result wrapper.
 * @constructor
 * @param {Scripts.App.Common.Data.enums.DialogResultStatus} status         The dialog result status.
 * @param {object} value                                                    The dialog result value.
 */
function DialogResult(status, value) {

    /**
  * @property {boolean} isSuccessful                                        Determines if dialog result status is successful.
  */
    Object.defineProperty(this, 'isSuccessful', {
        value: status === DialogResultStatus.resultRecieved,
        writable: false,
        enumerable: true
    });

    /**
    * @property {Scripts.App.Common.Data.enums.DialogResultStatus} status   The dialog result status.
    */
    Object.defineProperty(this, 'status', {
        value: status,
        writable: false,
        enumerable: true
    });

    /**
    * @property {object} value                                              The dialog result value.
    */
    Object.defineProperty(this, 'value', {
        value: value,
        writable: true,
        enumerable: true
    });
}

/**
 * The logging info wrapper.
 * @constructor
 * @param {string} logLevel                                             The logging level.
 * @param {string} action                                               The logging action in format class -> method/param.
 * @param {string} user                                                 The current user.
 * @param {string} officeHost                                           The current office host identifier.
 * @param {string} platform                                             The current device running platform.
 * @param {string} version                                              The current device running app version.
 * @param {object} data                                                 The current object creation date.
 */
function LogInfo(logLevel, action, user, officeHost, platform, version, data) {

    /**
    * @property {string} appId                                          Gets application identifier.
    */
    Object.defineProperty(this, 'appId', {
        value: Constants.APP_ID + Constants.SPACE_STRING + version,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} officeHost                                     Gets application host identifier.
    */
    Object.defineProperty(this, 'officeHost', {
        value: officeHost,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} platform                                       Gets device running platform.
    */
    Object.defineProperty(this, 'platform', {
        value: platform,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} cabinetId                                       Gets the logging level.
    */
    Object.defineProperty(this, 'logLevel', {
        value: logLevel,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} action                                          Gets logging action.
    */
    Object.defineProperty(this, 'action', {
        value: action,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} cabinetId                                      Gets the user email address.
    */
    Object.defineProperty(this, 'user', {
        value: user,
        writable: false,
        enumerable: true
    });
    
    /**
    * @property {string} creationDate                                   Gets the current object creation date.
    */
    Object.defineProperty(this, 'creationDate', {
        value: new Date().toISOString(),
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} requestOrigin                                  Gets the current request origin.
    */
    Object.defineProperty(this, 'requestOrigin', {
        value: window.location.origin,
        writable: false,
        enumerable: true
    });

    /**
    * @property {object} data                                           Gets the logging data.
    */
    Object.defineProperty(this, 'data', {
        value: data || Constants.NO_VALUE,
        writable: false,
        enumerable: true
    });
}

/**
 * The filing data wrapper.
 * @constructor
 * @param {Array<object>} predictionData                                           The prediction data.
 * @param {string} customSubject                                                   The custom subject.
 * @param {string} internetMessageId                                               The Internet message identifier.
 * @param {string} exchangeItemId                                                  The exchange item identifier.
 * @param {Array<Scripts.App.Common.Data.enums.FileAccess>} fileAccessList         The file access list.
 */
function FilingData(predictionData, customSubject, internetMessageId, exchangeItemId, fileAccessList) {
 
    /**
    * @property {string} customSubject Gets the custom subject.
    */
    Object.defineProperty(this, 'customSubject', {
        value: customSubject,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} predictionSearchId Gets the prediction search identifier.
    */
    Object.defineProperty(this, 'predictionSearchId', {
        value: predictionData.filingLocationListData,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} internetMessageId Gets the Internet message identifier.
    */
    Object.defineProperty(this, 'internetMessageId', {
        value: internetMessageId,
        writable: false,
        enumerable: true
    });

    /**
    * @property {string} exchangeItemId Gets the exchange item identifier.
    */
    Object.defineProperty(this, 'exchangeItemId', {
        value: exchangeItemId,
        writable: false,
        enumerable: true
    });
}

/**
 * The cancellation token source.
 * @constructor
 * @param {object}   token                                                      The token object.
 * @param {function} cancelFunction                                             The cancel function.
 */
function CancellationTokenSource(token, cancelFunction) {
    /**
    * @property {object} token               The token object for cancellation.
    */
    Object.defineProperty(this, 'token', {
        value: token,
        writable: true
    });

    /**
    * @property {object} cancel               The function for cancellation.
    */
    Object.defineProperty(this, 'cancelFunction', {
        value: cancelFunction,
        writable: true
    });

    /**
    * @property {object} cancel               Determines if cancellation was requested.
    */
    Object.defineProperty(this, 'isCancellationRequested', {
        value: false,
        writable: true
    });

    /**
    * Requests cancellation.
    * @private
    */
    this.cancel = function () {
        this.isCancellationRequested = true;

        if (this.cancelFunction) {
            this.cancelFunction();
        }
    };
}

/**
* The cancellation token source.
* @constructor
* @param {string}                                           taskId                The filing task identifier.
* @param {Scripts.App.Common.Data.enums.FilingTaskType}     type                  The filing task type(optional, default -  FilingTaskType.regular).
*/
function FilingTask(taskId, type) {
    /**
    * @property {string} taskId                                                    The filing task identifier.
    */
    Object.defineProperty(this, 'id', {
        value: taskId,
        writable: false
    });

    /**
    * @property {Scripts.App.Common.Data.enums.FilingTaskType} type                The filing task type.
    */
    Object.defineProperty(this, 'type', {
        value: type || FilingTaskType.regular,
        writable: false
    });

    /**
    * @property {string} intervalStep                                               The filing task interval step.
    */
    Object.defineProperty(this, 'intervalStep', {
        value: 0,
        writable: true
    });

    /**
    * @property {int} modifyTimeStamp                                               The filing task last modify timestamp.
    */
    Object.defineProperty(this, 'modifyTimeStamp', {
        value: new Date().getTime(),
        writable: true
    });

    /**
    * @property {string} response                                                   The filing task response.
    */
    Object.defineProperty(this, 'response', {
        value: null,
        writable: true
    });

    /**
    * @property {string} cancellation                                               The filing task cancellation source.
    */
    Object.defineProperty(this, 'cancellationSource', {
        value: new CancellationTokenSource(),
        writable: false
    });
}

